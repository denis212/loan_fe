import React, { Component } from "react";

import { Container, Row, Col, Input, Button, Card, CardHeader, CardBody } from "reactstrap";
import ModalForm from "../../components/Modals/Modal";
import { CSVLink } from "react-csv";
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
/* 
for documentation react-table purpose
https://github.com/tannerlinsley/react-table
*/
class Offering extends Component {
  state = {
    data: [],
    filteredData: [],
    page: 0,
    totalPage: 0,
    nextPage: 0,
    prevPage: 0,
    limit: 5,
    searchInput: "",
  };

  getdata() {
    const user = JSON.parse(localStorage.getItem("user"));
    fetch(
      `https://cors-anywhere.herokuapp.com/http://178.128.222.35:9100/loan-engine-web-services/api/offeringpackage`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => response)
      .then((response) => {
        if (response.data) {
          this.setState({ data: response.data });
        }

        this.setState({});
      });
  }

  addItemToState = (item) => {
    this.setState((prevState) => ({
      data: [...prevState.data, item],
    }));
  };

  updateState = (data) => {
    const itemIndex = this.state.data.findIndex(
      (data) => data.offerID === data.offerID
    );
    const newArray = [
      // destructure all data from beginning to the indexed item
      ...this.state.data.slice(0, itemIndex),
      // add the updated item to the array
      data,
      // add the rest of the data to the array from the index after the replaced item
      ...this.state.data.slice(itemIndex + 1),
    ];
    this.setState({ data: newArray });
  };

  deleteItemFromState = (offerID) => {
    const updateddata = this.state.data.filter(
      (data) => data.offerID !== offerID
    );
    this.setState({ data: updateddata });
  };

  componentDidMount() {
    this.getdata();
  }
  handleChange = (event) => {
    this.setState({ searchInput: event.target.value }, () => {
      this.globalSearch();
    });
  };
  globalSearch = () => {
    let { searchInput, data } = this.state;
    let filteredData = data.filter((value) => {
      return (
        value.offerID.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.packageType.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.value.toString().toLowerCase().includes(searchInput.toLowerCase())
      );
    });
    this.setState({ filteredData: filteredData });
  };
  deleteItem = (offerID) => {
    let confirmDelete = window.confirm("Delete item forever?");
    if (confirmDelete) {
      const user = JSON.parse(localStorage.getItem("user"));

      fetch(
        "https://cors-anywhere.herokuapp.com/http://178.128.222.35:9100/loan-engine-web-services/api/offeringpackage/" +
          `${offerID}`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.accessToken,
          },
        }
      )
        .then((response) => response.json())
        .then((response) => response.code)
        .then((code) => {
          if (code >= 200) {
            window.location.reload();
          }
        });
    }
  };
  columns = [
    {
      Header: "ID",
      accessor: "offerID",
    },
    {
      Header: "Package Type",
      accessor: "packageType",
    },
    {
      Header: "Value",
      accessor: "value",
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <>
          <ModalForm
            buttonLabel="Edit"
            item={row}
            updateState={this.updateState}
          />
          <Button color="danger" onClick={() => this.deleteItem(row.offerID)}>
            Delete
          </Button>
        </>
      ),
    },
  ];
  render() {
    let { data, columns, searchInput } = this.state;
    return (
      <Card>
      <CardHeader>
        Table Offering Package
      </CardHeader>
      <CardBody>
      <Container className="App">
        <Row>
          <Col>
            <h1 style={{ margin: "20px 0" }}></h1>
          </Col>
        </Row>

        <Row>
          <Col>
          <span class="float-left">
            <CSVLink
              filename={"offering_package.csv"}
              color="primary"
              style={{ float: "left", marginRight: "10px" }}
              className="btn btn-primary"
              data={this.state.data}
            >
              Download CSV
            </CSVLink>
            </span>
            <span class="float-left">
            <ModalForm
              buttonLabel="Add Item"
              addItemToState={this.addItemToState}
            />
            </span>
            <span class="float-right">
          <Input
              size="large"
              name="searchInput"
              value={this.state.searchInput || ""}
              onChange={this.handleChange}
              label="Search"
              placeholder="Search"
            />
          </span>
          </Col>
        </Row>

        <Row>
          <Col>
          <br />
            <ReactTable
              data={
                this.state.filteredData && this.state.filteredData.length
                  ? this.state.filteredData
                  : this.state.data
              }
              columns={this.columns}
              defaultPageSize={10}
              className="-striped -highlight"
            />
          </Col>
        </Row>
      </Container>
      <br />
      </CardBody>
      </Card>
    
    );
  }
}

export default Offering;
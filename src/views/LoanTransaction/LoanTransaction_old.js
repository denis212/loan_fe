import React, { Component } from "react";

import { Container, Row, Col, CardHeader, CardBody, Card } from "reactstrap";
import ModalForm from "../../components/Modals/ModalTransaction";
import DataTable from "../../components/Tables/DataTablesTransaction";
import { CSVLink } from "react-csv";

class Transaction extends Component {
  state = {
    data: [],
  };

  getdata() {
    const user = JSON.parse(localStorage.getItem("user"));
    // /page?pageLimit=4&pageNumber=1 weird endpoint ?
    fetch(
      "https://cors-anywhere.herokuapp.com/http://178.128.222.35:9100/loan-engine-web-services/api/loantransaction",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => response.data)
      .then((data) => {
        if (data) {
          this.setState({ data });
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
    const itemIndex = this.state.data.findIndex((data) => data.loanTrxID === data.loanTrxID);
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

  deleteItemFromState = (loanTrxID) => {
    const updateddata = this.state.data.filter((data) => data.loanTrxID !== loanTrxID);
    this.setState({ data: updateddata });
  };

  componentDidMount() {
    this.getdata();
  }

  render() {
    return (
      <Card>
      <CardHeader>
        Table Transaction
      </CardHeader>
      <CardBody>
      <Container className="App">
        <Row>
          <Col>
            <h1 style={{ margin: "20px 0" }}></h1>
          </Col>
        </Row>

        <Row>
          <br />
          <br />
          <br />
          <Col>
            <CSVLink
              filename={"Transaction.csv"}
              color="primary"
              style={{ float: "left", marginRight: "10px" }}
              className="btn btn-primary"
              data={this.state.data}
            >
              Download CSV
            </CSVLink>
            <ModalForm
              buttonLabel="Add Item"
              addItemToState={this.addItemToState}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <DataTable
              data={this.state.data}
              updateState={this.updateState}
              deleteItemFromState={this.deleteItemFromState}
            />
          </Col>
        </Row>
      </Container>
      </CardBody>
      </Card>
    );
  }
}

export default Transaction;

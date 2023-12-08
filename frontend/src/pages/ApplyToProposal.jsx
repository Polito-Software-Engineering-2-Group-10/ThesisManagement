import { Navigation } from "./Navigation.jsx";
import API from "../API.jsx";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Button, Container, Row, Col, Alert, Modal,Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import useNotification from "../hooks/useNotifcation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ApplyToProposal(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { propId } = useParams();
  const [proposal, setProposal] = useState(null);
  const [timeoutHandle, setTimeoutHandle] = useState(null);
  const notify = useNotification();
  const [file, setFile] = useState(null)
  
  const upload = () => {
    API.uploadFile(file)
    .then( res => {})
    .catch(er => console.log(er))
  }


  useEffect(() => {
    API.getProposal(propId)
      .then((p) => {
        setProposal(p);
      })
      .catch((err) => console.log(err));
  }, [propId]);

  const addApplication = (p_id) => {

    const application = {
      proposal_id: p_id,
      apply_date: dayjs(),
      file: file
    };
    setErrorMessage("");
    props.addApplication(
      application,
      () => {
        notify.success("Application submitted correctly");
        const timeout = setTimeout(() => {
          navigate("/");
        }, 3400);
        setTimeoutHandle(timeout);
      },
      (err) => {
        console.log(err);
        if (err) {
            notify.error(err.error);
        } else {
            notify.error("Something went wrong, please try again!");
        }
        //setErrorMessage("You can't apply to the same proposal twice");
      }
    );
  };

  const handleGoBack = () => {
    if (timeoutHandle) clearTimeout(timeoutHandle);
    setTimeoutHandle(null);
    navigate("/search");
  };

  return (
    <>
      <ToastContainer />
      <Navigation
        logout={props.logout}
        loggedIn={props.loggedIn}
        user={props.user}
      />
      {proposal && propId
        ? [proposal].map((p) => {
            return (
              <Container
                key={p.id}
                style={{ paddingTop: "30px", width: "70%", margin: "0 auto" }}
              >
                
                

                <Row>
                  <Col>
                    <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
                      {p.title}
                    </h1>
                    <p>
                      <b>Professor:</b> {p.teacher_name} {p.teacher_surname}
                    </p>
                    <p>
                      <b>Supervisor:</b> {p.supervisor}
                    </p>
                    <p>
                      <b>Co-supervisors:</b>{" "}
                      {p.co_supervisor.map((c, i, arr) => {
                        return `${arr[i + 1] ? c + ", " : c}`;
                      })}
                    </p>
                    <p>
                      <b>Keywords:</b>{" "}
                      {p.keywords.map((k, i, arr) => {
                        return `${arr[i + 1] ? k + ", " : k}`;
                      })}
                    </p>
                    <p>
                      <b>Type:</b> {p.type}
                    </p>
                    <p>
                      <b>Groups:</b>{" "}
                      {p.groups.map((g, i, arr) => {
                        return `${arr[i + 1] ? g + ", " : g}`;
                      })}
                    </p>
                    <p>
                      <b>Description:</b> {p.description}
                    </p>
                    <p>
                      <b>Required Knowledge:</b>{" "}
                      {p.required_knowledge.map((r, i, arr) => {
                        return `${arr[i + 1] ? r + ", " : r}`;
                      })}
                    </p>
                    <p>
                      <b>Notes</b>: {p.notes}
                    </p>
                    <p>
                      <b>Expiration:</b>{" "}
                      {dayjs(p.expiration).format("DD/MM/YYYY")}
                    </p>
                    <p>
                      <b>Level:</b> {p.level}
                    </p>
                    <p>
                      <b>Programs: </b>
                      {p.programmes.map((p, i, arr) => {
                        return `${arr[i + 1] ? p + ", " : p}`;
                      })}
                    </p>
                  </Col>
                </Row>
                {errorMessage ? (
                  <Alert
                    variant="danger"
                    dismissible
                    onClick={() => setErrorMessage("")}
                  >
                    {errorMessage}
                  </Alert>
                ) : (
                  ""
                )}
                <Row style={{ marginTop: "15px", marginBottom: "30px" }}>
                  {props.loggedIn && props.user.role === "student" ? (
                    <Col
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Select CV for this application</Form.Label>
                            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
                            {
                        /*<Button variant="info" onClick={upload}>Upload CV</Button>
                        
                       
                        <div>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
                       
                        </div>
                        */
                        }

                      <Button
                        onClick={() => addApplication(p.id)}
                        variant="success"
                      >
                        Apply Now!
                      </Button>
                      </Form.Group>
                    </Col>
                  ) : (
                    ""
                  )}
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button onClick={handleGoBack} variant="danger">
                      Go Back
                    </Button>
                  </Col>
                </Row>
              </Container>
            );
          })
        : ""}
    </>
  );
}
export default ApplyToProposal;

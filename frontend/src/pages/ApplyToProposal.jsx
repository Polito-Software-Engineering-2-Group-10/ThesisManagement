import { Navigation } from "./Navigation.jsx";
import API from "../API.jsx";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Button, Container, Row, Col, Alert, Modal, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import useNotification from "../hooks/useNotification.js";
import { ToastContainer } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal.jsx";
import "react-toastify/dist/ReactToastify.css";

function ApplyToProposal(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { propId } = useParams();
  const [proposal, setProposal] = useState(null);
  const [timeoutHandle, setTimeoutHandle] = useState(null);
  const notify = useNotification();
  const [file, setFile] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  //modal for add CV
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setTempFile(null);
  }
  const handleShow = () => setShow(true);

  const handleSaveFile = () => {
    setFile(tempFile);
    setShow(false);
  }

  const handleSelectFile = (e) => {
    setTempFile(e.target.files[0])
  }

  const upload = () => {
    API.uploadFile(file)
      .then(res => { })
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
    upload();
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
        if(timeoutHandle) clearTimeout(timeoutHandle);
        setTimeoutHandle(null);
        navigate('/');
    }

    const handleApplyClick = (proposal) => {
        setShowModal(true);
        setSelectedProposal(proposal);
    }

  return (
    <>
      <ToastContainer />
      <Navigation
        logout={props.logout}
        loggedIn={props.loggedIn}
        user={props.user}
      />
      
      <ConfirmModal 
        title = {"Do you want to apply to the proposal?"}
        text  = {"Your application will be submitted to the professor."}
        show={showModal} setShow={setShowModal} 
        onConfirm={()=>addApplication(selectedProposal)}
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

              <Row style={{marginBottom: '10px'}}>
                  <Col style={{ display: 'flex', alignItems: 'center' }}>
                      {props.loggedIn && props.user.role === "student" ?
                          <div style={{ marginRight: '10px' }}>
                              <Button variant="primary" onClick={handleShow}>
                                  {file ? "Change CV" : "Add CV"}
                              </Button>
                          </div>
                          : null
                      }
                      {file ?
                          <p style={{ marginLeft: '5px', marginTop: '15px' }}>
                              <b>{file.name}</b> <i style={{ cursor: 'pointer' }} className="bi bi-x-lg" onClick={() => setFile(null)} onKeyDown={() => setFile(null)}></i>
                          </p> :
                          <p style={{ marginLeft: '5px', marginTop: '15px' }}>
                              <b>&nbsp;</b>
                          </p>
                      }
                  </Col>
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Select CV for this application</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Control type="file" onChange={handleSelectFile} />
                      </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between">
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleSaveFile}>
                        Save
                      </Button>
                    </Modal.Footer>
                  </Modal>

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
              <Row style={{ marginTop: "15px", marginBottom: "30px" }} >
                {props.loggedIn && props.user.role === "student" ? (
                  <>
                    <Col
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >

                      <Button
                        onClick={() => handleApplyClick(p.id)}
                        variant="success"
                      >
                        Apply Now!
                      </Button>
                    </Col>
                  </>
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

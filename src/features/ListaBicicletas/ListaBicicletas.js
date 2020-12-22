import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  SelectIncident,
  ChangePage,
  ChangeTitle,
  ChangeInitialDate,
  ChangeFinalDate,
  GetInitialDate,
  GetFinalDate,
  SearchIncidents,
  GetState
} from './ListaBicicletasReducer.d.ts';
import styles from './ListaBicicletas.module.css';

import { formatDate } from '../../helper/util.js';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import Image from "react-bootstrap/Image";

import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";

export function ListaBicicletas() {
  const dispatch = useDispatch();

  const IncidentSelected = useSelector(GetState).incidentSelected;
  let Incidents = useSelector(GetState).incidents;
  const CurrentPage = useSelector(GetState).paramsToSearch.currentPage;
  const ErrorMensagem = useSelector(GetState).errorMensagem;
  const Searching = useSelector(GetState).searching;

  const params = useSelector(GetState).paramsToSearch;
  const PreviousPageBlocked = CurrentPage == 1;
  const NextPageBlocked = Incidents  == 0 || (CurrentPage * 10 >= Incidents.length);

  const onChangeDate = (value, isInitialDate) => {
    if(isInitialDate)
      dispatch(ChangeInitialDate(value));
    else
      dispatch(ChangeFinalDate(value));
  }
  const OnChangedTitle = (value) => {
    dispatch(ChangeTitle(value));
  }

  const Filters = () => (
    <Container>
      <Row>
        <Col>
          <h3>PESQUISAR BICICLETAS ROUBADAS NAS PROXIMIDADES</h3>
        </Col>
      </Row>
      <Row>
        <Col md='6' xs='6'>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Título do Caso</Form.Label>
            <Form.Control 
            onChange ={(event) => OnChangedTitle(event.target.value)}
            type="text" />
          </Form.Group>
        </Col>
        <Col md='2' xs ='2'>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Ocorrido De</Form.Label>
            <Form.Control type="text"
            onClick = {() => onChangeDate("", true)}
            onChange ={(event) => onChangeDate(event.target.value, true)}
            value={useSelector(GetInitialDate)}
            maxLength={10}
            placeholder="__/__/____"/>
          </Form.Group>
        </Col>
        <Col md='2' xs ='2'>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Até</Form.Label>
            <Form.Control type="text"
             onClick = {() => onChangeDate("", false)}
             onChange = {(event) => onChangeDate(event.target.value, false)}
             value={useSelector(GetFinalDate)}
             maxLength={10}
             placeholder="__/__/____"/>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md='6' xs='6'>
          <Button onClick={()=> {dispatch(SearchIncidents(params))}
            }>
            Pesquisar
          </Button>
        </Col>
      </Row>
    </Container>
  );

  const IncidentsTable = () => {
    var Rows = []
    var _incidents = Incidents.slice((CurrentPage - 1) * 10, (CurrentPage) * 10);
    
    if(Searching)
    {
      Rows.push(
        <div className={ErrorMensagem != "" ? styles.ErroNaPesquisa : styles.SemResultados}>
          <i>Pesquisando...</i>
        </div>
      )
    }
    else if(_incidents.length == 0){
      Rows.push(
        <div className={ErrorMensagem != "" ? styles.ErroNaPesquisa : styles.SemResultados}>
          <i>{ErrorMensagem != "" ? ErrorMensagem : "Nenhum caso a ser exibido. Por favor verifique os filtros de pesquisa ou realize a primeira consulta"}.</i>
        </div>
      )
    }

    for (let index = 0; index < _incidents.length; index++) {
      const incident = _incidents[index];
      const DateOccurred = new Date(incident.occurred_at);
      const DateUpdated = new Date(incident.updated_at);
      
      Rows.push(
        <Row className={index % 2 == 0 ? styles.CasoDeRouboItemCinza : styles.CasoDeRouboItemBranco}>
          <Col xs={3} md={3} key={incident}>
            <Image 
            src={incident.media.image_url_thumb != null ? incident.media.image_url_thumb : 'https://bikeindex.org/assets/revised/bike_photo_placeholder-ff15adbd9bf89e10bf3cd2cd6c4e85e5d1056e50463ae722822493624db72e56.svg'}
             rounded height="120px" width="120px" />
          </Col>
          <Col xs={9} md={9}>
            <div style={{paddingTop:'5px'}}>
              <Row>
                <Col xs={12} md={12}>
                  <a href="#" onClick={() => {dispatch(SelectIncident(incident))}}>
                    <h5>{incident.title}</h5>
                  </a>
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col xs={4} md={4}>
                  <strong>Código</strong>
                  <p>{incident.id}</p>
                </Col>
                <Col xs={4} md={4}>
                  <strong>Data Ocorrido</strong>
                  <p>{formatDate(DateOccurred)}</p>
                </Col>
                <Col xs={4} md={4}>
                  <strong>Data Reportado</strong>
                  <p>{formatDate(DateUpdated)}</p>
                </Col>
              </Row>
            </div>
          </Col>
        <br></br>
        </Row>
      )
    }
    return (
      <Container className={styles.CasosDeRouboDataTable}>
       {Rows} 
      </Container>
    );
  };

  const Footer = () => {
    const paginationBasic = (
      <Container>
        <Row>
          <Col></Col>
          <Col style={{textAlign:"center"}}>
            <Button disabled={PreviousPageBlocked} onClick={() => dispatch(ChangePage(-1))} variant="light" title="Anterior">{"<<"}</Button>{' '}
            <Button disabled>{useSelector(GetState).paramsToSearch.currentPage}</Button>{' '}
            <Button disabled={NextPageBlocked} onClick={() => dispatch(ChangePage(1))} variant="light" title="Próximo">{">>"}</Button>{' '}
          </Col>
          <Col><p style={{float:"right"}}>{Incidents.length > 0 ? "Resultados Encontrados: " + Incidents.length : ""}</p></Col>
        </Row>
      </Container>
    );
    return paginationBasic;
  };

  const Details = () => {
    let DateOccurred = '';
    let DateUpdated = '';
    if(IncidentSelected != null)
    {
      DateOccurred =formatDate(new Date(IncidentSelected.occurred_at));
      DateUpdated = formatDate(new Date(IncidentSelected.updated_at));
    }
    
    return (
      <Modal
        show={IncidentSelected != null}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ModalHeader>
          <ModalTitle >
            {IncidentSelected != null ? IncidentSelected.title : ''}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Row>
          <Col xs={3} md={3}>
            <Image 
            src={IncidentSelected != null && IncidentSelected.media.image_url != null ? IncidentSelected.media.image_url : 'https://bikeindex.org/assets/revised/bike_photo_placeholder-ff15adbd9bf89e10bf3cd2cd6c4e85e5d1056e50463ae722822493624db72e56.svg'}
             width="100%" />
          </Col>
          <Col xs={9} md={9}>
            <div style={{paddingTop:'5px'}}>
              <Row>
                <Col xs={4} md={4}>
                  <strong>Endereço</strong>
                  <p>{IncidentSelected != null && IncidentSelected.address != null && IncidentSelected.address != '' ? IncidentSelected.address : 'Endereço não informado.'}</p>
                </Col>
                <Col xs={4} md={4}>
                  <strong>Data Ocorrido</strong>
                  <p>{DateOccurred}</p>
                </Col>
                <Col xs={4} md={4}>
                  <strong>Data Reportado</strong>
                  <p>{DateUpdated}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <strong>Descrição do Caso</strong>
                  <p>{IncidentSelected != null && IncidentSelected.description != null && IncidentSelected.description != '' ? IncidentSelected.description : 'Descrição não informada.'}</p>
                </Col>
              </Row>
            </div>
          </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => {dispatch(SelectIncident(null))}}>Fechar</Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <div style={{padding: '2%'}}>
      {Filters()}
      <br></br>
      {}
      {IncidentsTable()}
      {Footer()}

      {Details()}
    </div>
  );

}

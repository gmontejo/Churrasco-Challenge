import React from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function SiteCard(props) {
  let { url_imagen, ubicacion, descripcion, nombre } = props.site;

  return (
    <Card>
      <Card.Img variant="top" src={url_imagen} />
      <Card.Body>
        <Card.Title>{nombre}</Card.Title>
        <Card.Text>{descripcion}</Card.Text>
        <Button onClick={() => props.onclick(ubicacion)} variant="logout">
          See on Maps
        </Button>
      </Card.Body>
    </Card>
  );
}

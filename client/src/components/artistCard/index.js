import { h } from "preact";
import { Card, Button, Row, Col } from "react-bootstrap";

import style from "./style";
import { playTracks } from "../../utils/requests";

const ArtistCard = ({ artist }) => (
  <Card className={`${style.card} mx-1 my-1`}>
    <Card.Title className={style.cardTitle}>{artist.name}</Card.Title>
    <Card.Img src={artist.image} onClick={() => playTracks(artist.artistId)} />
    <Row className="mt-2">
      <Col xs="6" className="text-center">
        Tracks
      </Col>
      <Col xs="6" className="text-center">
        Queue
      </Col>
    </Row>
  </Card>
);

export default ArtistCard;

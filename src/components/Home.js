import React, { useState, useEffect } from "react";
import { getSitesData } from "../client";
import { NavbarComponent as Navbar } from "./Navbar";
import SiteCard from "./SiteCard";
import mapboxgl from "mapbox-gl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import CardColumns from "react-bootstrap/CardColumns";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import plane from "../img/plane.png";
import clearButton from "../img/clearButton.png";

export default function Home(props) {
  const [allSites, setAllSites] = useState();
  const [filteredSites, setFilteredSites] = useState([]);
  const [doneLoading, setDoneLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState();

  mapboxgl.accessToken =
    "pk.eyJ1IjoiZ21vbnRlam8iLCJhIjoiY2tocDFxemZsMDk3bjJybDE2bXEwNzR6biJ9.ybqnyLY9JV_D5IL1Vfh-_A";

  useEffect(() => {
    if (showMap && coordinates) {
      let map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/satellite-streets-v11", // stylesheet location
        center: [coordinates.long, coordinates.lat], // starting position [lng, lat]
        zoom: 16, // starting zoom
      });
      new mapboxgl.Marker()
        .setLngLat([coordinates.long, coordinates.lat])
        .addTo(map);
    }
  }, [showMap, coordinates]);

  useEffect(() => {
    let token = sessionStorage.getItem("authToken");
    const getData = async () => {
      let arrayData = await getSitesData(token);
      setAllSites(arrayData);
      setFilteredSites(arrayData);
      setDoneLoading(true);
    };

    getData();
  }, []);

  const handleSearch = (e) => {
    let sitesFilter = allSites.filter((site) => {
      return site.nombre
        .toLowerCase()
        .includes(e.target.value.toLowerCase().replace(/\s+/g, ""));
    });
    setFilteredSites(sitesFilter);
  };

  const handleClearSearch = () => {
    const search = document.getElementById("searchValue");
    search.value = "";
    setFilteredSites(allSites);
  };

  const generateMap = (coordinates) => {
    const long = coordinates._long || coordinates._lon;
    const lat = coordinates._lat;
    setCoordinates({ long, lat });
    setShowMap(true);
  };

  return (
    <React.Fragment>
      <Navbar />
      <Container fluid className="greetings mb-5 px-md-5">
        <Row className="px-md-5 flex-column align-items-center justify-content-center">
          <h1>
            Hey! Welcome to Churrasco Travel{" "}
            <span>
              <img className="img-fluid" src={plane} alt="plane" />
            </span>
          </h1>
          <h5>
            These are some of the destinations we can offer FOR FREE!{" "}
            <OverlayTrigger
              trigger={["hover", "focus"]}
              animation={true}
              placement={"bottom"}
              overlay={
                <Popover id="popover-positioned-right">
                  <Popover.Title as="h3">Disclaimer:</Popover.Title>
                  <Popover.Content>
                    <p className="m-0">
                      We only offer Google Maps based travels.
                    </p>
                    <p className="m-0">
                      If you have any issues while traveling... it's Google's
                      fault.
                    </p>
                  </Popover.Content>
                </Popover>
              }
            >
              <span className="warning-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </span>
            </OverlayTrigger>
          </h5>
        </Row>
      </Container>
      {!doneLoading ? (
        <div className="flex-grow-1">
          <Spinner className="text-light flex-grow-1" animation="border" />
        </div>
      ) : (
        <Container fluid className="px-3 px-md-5 flex-grow-1 overflow-hidden">
          <Row className="px-md-5 justify-content-center">
            <div className="search-bar">
              <input
                id="searchValue"
                onChange={handleSearch}
                type="text"
                placeholder="Find your next adventure"
              />
              <img
                className="clear-search-button"
                onClick={handleClearSearch}
                src={clearButton}
                alt=""
              />
            </div>
          </Row>
          <CardColumns className="modify-columns">
            {filteredSites &&
              filteredSites.map((site, i) => {
                return <SiteCard key={i} site={site} onclick={generateMap} />;
              })}
          </CardColumns>
          {/* </Row> */}
        </Container>
      )}
      <Modal size="lg" show={showMap} centered>
        <Container className="map-modal">
          <h3>You will be right here!</h3>
          <div id="map" style={{ width: "100%", height: "100%" }}></div>
          <Button
            onClick={() => setShowMap(false)}
            className="align-self-end mt-2"
            variant="logout"
          >
            Close
          </Button>
        </Container>
      </Modal>
    </React.Fragment>
  );
}

import React from "react";
import { Row, Col } from "react-bootstrap";

function AboutScreen() {
    return (
        <div>
            <Row className="p-3">
                <Col>
                    <h1 className="text-center">About Us</h1>
                    <div className="about-us-text py-3">
                        <p>
                            Welcome to Frame, your ultimate destination for all
                            things graphics cards! At Frame, we're passionate
                            about delivering top-tier performance and
                            cutting-edge technology to gamers, designers, and
                            tech enthusiasts alike. With a diverse selection of
                            graphics cards from leading brands, we're dedicated
                            to helping you elevate your visual experience to new
                            heights.
                        </p>
                        <p>
                            Backed by a team of experts who live and breathe
                            technology, we strive to provide unparalleled
                            customer service and support. Whether you're a
                            seasoned pro or just diving into the world of
                            high-performance computing, our knowledgeable staff
                            is here to guide you every step of the way.
                        </p>
                        <p>
                            At Frame, we believe that every pixel matters.
                            That's why we carefully curate our collection to
                            offer the latest innovations in graphics technology,
                            ensuring that you have access to the power you need
                            to fuel your creativity and dominate the
                            competition.
                        </p>
                        <p>
                            Experience the difference with Frame – where
                            performance meets passion.
                        </p>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default AboutScreen;

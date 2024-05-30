import React from "react";

function RatingReview({ value, text, color, onClick }) {
    return (
        <div className="rating">
            {[...Array(5)].map((_, index) => (
                <span
                    key={index}
                    onClick={() => onClick(index + 1)}
                    style={{ cursor: "pointer" }}
                >
                    <i
                        style={{ color }}
                        className={
                            value >= index + 1
                                ? "fas fa-star"
                                : value >= index + 0.5
                                ? "fas fa-star-half-alt"
                                : "far fa-star"
                        }
                    ></i>
                </span>
            ))}
            <span>{text && text}</span>
        </div>
    );
}

export default RatingReview;

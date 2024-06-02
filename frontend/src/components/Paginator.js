import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Paginator({ pages, page, query = "" }) {
    if (query) {
        const urlParams = new URLSearchParams(query);
        query = urlParams.get("query") || "";
    }

    // Construct the search query string.
    const searchQuery = query ? `query=${query}&` : "";

    return (
        pages > 1 && (
            <Pagination>
                {[...Array(pages).keys()].map((i) => (
                    <LinkContainer
                        key={i + 1}
                        to={{
                            search: `?${searchQuery}page=${i + 1}`,
                        }}
                    >
                        <Pagination.Item active={i + 1 === page}>
                            {i + 1}
                        </Pagination.Item>
                    </LinkContainer>
                ))}
            </Pagination>
        )
    );
}

export default Paginator;

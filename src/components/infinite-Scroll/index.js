import React from "react";
import "./index.css";
import InfiniteScroll from "react-infinite-scroll-component";
export function InfiniteScrolls(props) {
	return (
		<InfiniteScroll
			dataLength={1500}
			hasMore={false}
			loader={props.loader}
			className={"scrollInfinite"}
			next={props.next}
		>
			{" "}
			{props.children}
		</InfiniteScroll>
	);
}

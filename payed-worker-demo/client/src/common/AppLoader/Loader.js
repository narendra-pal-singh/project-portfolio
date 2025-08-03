// Loader.js
// This component displays a loading bar when loaderShow() returns true.

import React, { Component } from "react";
import BarLoader from "react-bar-loader";

// Functional component version (cleaner than class-based here)
export default class Loader extends Component {
    render() {
        const { loaderShow } = this.props; // Destructure for cleaner code

        // If loaderShow() returns false, don't render anything
        if (!loaderShow()) return null;

        return (
            <div className="row">
                <div className="col-lg-12 pd_lft_rt">
                    {/* BarLoader from react-bar-loader with custom color and height */}
                    <BarLoader color="#1D8BF1" height="2" />
                </div>
            </div>
        );
    }
}

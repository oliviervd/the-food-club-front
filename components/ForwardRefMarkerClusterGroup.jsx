'use client'
import React, { forwardRef } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";

// This makes sure the ref points to the actual Leaflet layer group
const ForwardRefMarkerClusterGroup = forwardRef((props, ref) => {
    return <MarkerClusterGroup {...props} ref={ref} />;
});

export default ForwardRefMarkerClusterGroup;
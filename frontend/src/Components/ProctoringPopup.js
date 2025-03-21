import React from "react";
import Draggable from "react-draggable";

const ProctoringPopup = ({ videoRef }) => {
    return (
        <Draggable>
            <div style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "200px",
                height: "150px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: "5px",
                borderRadius: "10px",
                cursor: "move"
            }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "100%", borderRadius: "8px" }} />
            </div>
        </Draggable>
    );
};

export default ProctoringPopup;

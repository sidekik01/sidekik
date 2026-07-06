import { ImageResponse } from "next/og";

export const size = {
  height: 32,
  width: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#090a0d",
          color: "white",
          display: "flex",
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 20,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        s
      </div>
    ),
    size,
  );
}

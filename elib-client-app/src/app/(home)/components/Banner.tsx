"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
const Banner = () => {
    // Custom Next Button
    const NextArrow = (props: any) => {
        const { className, onClick } = props;
        return (
            <div
                className={`${className} bg-green-600`}
                onClick={onClick}
                style={{ ...arrowStyles, right: "10px" }}
            >
                <span>→</span>
            </div>
        );
    };
    // Custom Prev Button
    const PrevArrow = (props: any) => {
        const { className, onClick } = props;
        return (
            <div
                className={className}
                onClick={onClick}
                style={{ ...arrowStyles, left: "10px" }}
            >
                <span>←</span>
            </div>
        );
    };
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    const arrowStyles: React.CSSProperties = {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "10px",
        cursor: "pointer",
        zIndex: 4,
    };
    return (
        <>
            <div className="container mx-auto slider-container">
                <Slider {...settings} className="bg-green-300 pb-1 mt-2 ">
                    <div>
                        <Image
                            src={`/banner/banner-1.webp`}
                            alt="billboard"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </div>
                    <div>
                        <Image
                            src={`/banner/banner-2.webp`}
                            alt="billboard"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </div>
                    <div>
                        <Image
                            src={`/banner/banner-3.webp`}
                            alt="billboard"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </div>
                </Slider>
            </div>
        </>
    );
};
export default Banner;

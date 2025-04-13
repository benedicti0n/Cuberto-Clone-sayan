'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextAnimate } from '../ui/magicui/text-animate';
import * as motion from "motion/react-client";

const Landingpage = () => {
    const [line1, setLine1] = useState('I am a sharp,');
    const [line2, setLine2] = useState('skilled,');
    const [line3, setLine3] = useState('adept');
    const [line4, setLine4] = useState('mind.');

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchHeaderLines = async () => {
            try {
                const res = await axios.get(`${serverUrl}/headerLine/getHeaderLine`);
                const lines = res.data?.headerLines;

                if (Array.isArray(lines) && lines.length >= 4) {
                    setLine1(lines[0]);
                    setLine2(lines[1]);
                    setLine3(lines[2]);
                    setLine4(lines[3]);
                } else {
                    console.warn('Invalid headerLines response:', lines);
                }
            } catch (error) {
                console.error('Failed to fetch header lines:', error);
            }
        };

        fetchHeaderLines();
    }, []);

    return (
        <div className='h-[75vh] sm:h-[80vh] md:h-[85vh] lg:h-[80vh] w-full flex flex-col relative mb-[-160px] sm:mb-[-140px] md:mb-[-150px] lg:mb-[20px]'>
            <div className='flex justify-between items-center pt-4 sm:pt-5 md:pt-6 w-full px-5 sm:px-6 md:px-8 lg:px-12'>
                <h1 className='text-xl sm:text-xl md:text-2xl font-semibold'>sayan</h1>
            </div>

            <div className='h-full mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-40 mt-[-120px] sm:mt-[-100px] md:mt-[-60px] lg:mt-[10px] mb-6 sm:my-10 md:my-16 lg:my-20 flex flex-col justify-center'>
                <TextAnimate
                    animation="slideUp"
                    by="word"
                    className='font-regular text-4xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl'
                    style={{ animationDelay: "0s" }}
                >
                    {line1}
                </TextAnimate>

                <div className='flex items-center mt-1 sm:mt-2 gap-3 sm:gap-4 md:gap-5'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.4,
                            scale: { type: "spring", visualDuration: 1, bounce: 0 },
                        }}
                    >
                        <div className="ios-video-container">
                            <video
                                src="/assets/header.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                webkit-playsinline="true"
                                x-webkit-airplay="allow"
                                disablePictureInPicture
                                disableRemotePlayback
                            />
                        </div>
                    </motion.div>

                    <div style={{
                        position: "relative",
                        display: "inline-block",
                        translate: "none",
                        rotate: "none",
                        scale: "none",
                        transform: "translate(0px, 0%)",
                        padding: "0.2em",
                        willChange: "auto"
                    }}>
                        <TextAnimate
                            animation="slideUp"
                            by="word"
                            className='font-light-italic text-4xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl'
                            delay={0.3}
                        >
                            {line2}
                        </TextAnimate>
                    </div>

                    <TextAnimate
                        animation="slideUp"
                        by="word"
                        className='font-regular text-4xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl'
                        delay={0.6}
                    >
                        {line3}
                    </TextAnimate>
                </div>

                <TextAnimate
                    animation="slideUp"
                    by="word"
                    className='font-regular text-4xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl'
                    delay={0.9}
                >
                    {line4}
                </TextAnimate>
            </div>
        </div>
    );
};

export default Landingpage;

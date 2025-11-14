import React, { memo } from 'react';
import {
    Timeline,
    TimelineBody,
    TimelineContent,
    TimelineItem,
    TimelinePoint,
    TimelineTime,
    TimelineTitle,
} from "flowbite-react";

// Define your custom theme
const customTheme = {
    root: {
        direction: {
            horizontal: "sm:flex",
            vertical: "relative border-l border-gray-200 dark:border-gray-700"
        }
    },
    item: {
        root: {
            horizontal: "relative mb-6 sm:mb-0",
            vertical: "mb-10 ml-6"
        },
        content: {
            root: {
                base: "",
                horizontal: "mt-3 sm:pr-8",
                vertical: ""
            },
            body: {
                base: "mb-4 text-base font-normal text-gray-500 dark:text-gray-400"
            },
            time: {
                base: "mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
            },
            title: {
                base: "text-lg font-semibold text-gray-900 dark:text-white"
            }
        },
        point: {
            horizontal: "flex items-center",
            line: "hidden h-0.5 w-full bg-gray-200 sm:flex dark:bg-gray-700",
            marker: {
                base: {
                    horizontal: "absolute -left-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700",
                    vertical: "absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"
                },
                icon: {
                    base: "h-3 w-3 text-primary-600 dark:text-primary-300",
                    wrapper: "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-200 ring-8 ring-white dark:bg-primary-900 dark:ring-gray-900"
                }
            },
            vertical: ""
        }
    }
};

const LoveStoryTimeline = memo(function LoveStoryTimeline() {
    return (
        <div className='parent_couple_card'>
            <Timeline theme={customTheme}>
                <TimelineItem>
                    <TimelinePoint />
                    <TimelineContent>
                        <TimelineTime>2018</TimelineTime>
                        <TimelineTitle>First Meeting</TimelineTitle>
                        <TimelineBody>
                            Met at a mutual friend's birthday party in Delhi. Abhishek made Komal laugh within minutes of meeting.
                        </TimelineBody>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelinePoint />
                    <TimelineContent>
                        <TimelineTime>2019</TimelineTime>
                        <TimelineTitle>First Date</TimelineTitle>
                        <TimelineBody>
                            Coffee at India Habitat Centre turned into a three-hour conversation about life and dreams.
                        </TimelineBody>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelinePoint />
                    <TimelineContent>
                        <TimelineTime>2020</TimelineTime>
                        <TimelineTitle>First Trip Together</TimelineTitle>
                        <TimelineBody>
                            Traveled to Goa and discovered shared love for beaches, adventure, and trying new foods.
                        </TimelineBody>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelinePoint />
                    <TimelineContent>
                        <TimelineTime>2021</TimelineTime>
                        <TimelineTitle>Meeting the Families</TimelineTitle>
                        <TimelineBody>
                            Introduced each other to our families. Both families instantly connected and approved!
                        </TimelineBody>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelinePoint />
                    <TimelineContent>
                        <TimelineTime>2022</TimelineTime>
                        <TimelineTitle>The Proposal</TimelineTitle>
                        <TimelineBody>
                            Sunset proposal at Lodhi Gardens with close friends and family. Komal said "Yes!" surrounded by fairy lights.
                        </TimelineBody>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelinePoint />
                    <TimelineContent>
                        <TimelineTime>2023</TimelineTime>
                        <TimelineTitle>Engagement Ceremony</TimelineTitle>
                        <TimelineBody>
                            Traditional engagement ceremony with both families. Officially started our journey towards forever.
                        </TimelineBody>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelinePoint />
                    <TimelineContent>
                        <TimelineTime>2024</TimelineTime>
                        <TimelineTitle>Wedding Planning</TimelineTitle>
                        <TimelineBody>
                            Started planning our dream wedding together - choosing venues, themes, and making all the arrangements.
                        </TimelineBody>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelinePoint />
                    <TimelineContent>
                        <TimelineTime>2025</TimelineTime>
                        <TimelineTitle>Our Wedding Day</TimelineTitle>
                        <TimelineBody>
                            The day we become husband and wife! Celebrating our love with all our family and friends.
                        </TimelineBody>
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelinePoint />
                    <TimelineContent>
                        <TimelineTime>Future</TimelineTime>
                        <TimelineTitle>Our Forever</TimelineTitle>
                        <TimelineBody>
                            Building our life together, creating a home, and looking forward to all the adventures ahead.
                        </TimelineBody>
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
        </div>
    );
});

export default LoveStoryTimeline;
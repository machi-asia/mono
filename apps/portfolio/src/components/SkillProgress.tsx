"use client";

import React from "react";
import Tooltip from "./Tooltip";

export default function SkillProgress({
    name,
    years,
}: {
    name: string;
    years: number;
}) {
    const level = years >= 5 ? "Expert" : years >= 3 ? "Advanced" : "Intermediate";

    return (
        <Tooltip content={`${years} ${years === 1 ? "year" : "years"} of experience`}>
            <div className="skill-row">
                <span className="label skill-row-name">{name}</span>
                <span className="skill-row-years-num">{years}</span>
                <span className="skill-row-years-unit">{years === 1 ? "yr" : "yrs"}</span>
                <span className="skill-row-level" data-level={level.toLowerCase()}>
                    {level}
                </span>
            </div>
        </Tooltip>
    );
}

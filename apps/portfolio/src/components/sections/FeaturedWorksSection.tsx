"use client";

import React from "react";
import CinematicScrollShowcase from "./CinematicScrollShowcase";
import type { FeaturedWork } from "../../data/types";

interface FeaturedWorksSectionProps {
    featuredWorks: FeaturedWork[];
}

export default function FeaturedWorksSection({ featuredWorks }: FeaturedWorksSectionProps) {
    return <CinematicScrollShowcase featuredWorks={featuredWorks} />;
}

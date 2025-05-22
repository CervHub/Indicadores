"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// Opciones de cantidad de neumáticos con imagen
const TIRE_COUNT_OPTIONS = [
    { value: "4", label: "4", img: "/images/neumaticos/01.png" },
    { value: "6", label: "6", img: "/images/neumaticos/02.png" },
    { value: "10-I", label: "10-I", img: "/images/neumaticos/03.png" },
    { value: "10-II", label: "10-II", img: "/images/neumaticos/04.png" },
    { value: "12", label: "12", img: "/images/neumaticos/05.png" },
    { value: "14-I", label: "14-I", img: "/images/neumaticos/06.png" },
    { value: "14-II", label: "14-II", img: "/images/neumaticos/07.png" },
    { value: "8", label: "8", img: "/images/neumaticos/08.png" },
];

export default function SlideScale() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className="mx-auto max-w-xs">
            <Carousel
                setApi={setApi}
                className="w-full max-w-xs"
                opts={{ loop: true }}
            >
                <CarouselContent className="py-3">
                    {TIRE_COUNT_OPTIONS.map((option, index) => (
                        <CarouselItem key={option.value} className={cn("basis-[33%]")}>
                            <Card
                                className={cn(
                                    "transition-transform duration-500 flex flex-col items-center",
                                    {
                                        "scale-[1]": index !== current,
                                    }
                                )}
                            >
                                <CardContent className="flex flex-col items-center justify-center w-full h-full">
                                    <img
                                        src={option.img}
                                        alt={`Neumáticos ${option.label}`}
                                        className="w-full h-16 object-contain mb-2"
                                    />
                                    {/* Eliminado el número/label */}
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (api) api.scrollPrev();
                    }}
                />
                <CarouselNext
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (api) api.scrollNext();
                    }}
                />
            </Carousel>
        </div>
    );
}

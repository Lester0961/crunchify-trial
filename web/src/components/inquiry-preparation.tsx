"use client";

import { useId, useState } from "react";
import { DownIcon } from "./icons";

const topics = [
  {
    title: "Your business and territory",
    description: "Tell us what kind of business you run and where you operate.",
  },
  {
    title: "Your product selection",
    description:
      "Choose from Banana, Jackfruit, Apple and Broccoli Crunch. You can select more than one in your inquiry.",
  },
  {
    title: "Estimated monthly volume",
    description:
      "Include the volume you have in mind so we can understand what you’re looking for.",
  },
];

export function InquiryPreparation() {
  const id = useId();
  const [expanded, setExpanded] = useState<boolean[]>([true, false, false]);
  return (
    <div className="preparation-topics">
      {topics.map((topic, index) => (
        <div className="preparation-topic" key={topic.title}>
          <h3>
            <button
              type="button"
              id={`${id}-button-${index}`}
              aria-expanded={expanded[index]}
              aria-controls={`${id}-panel-${index}`}
              onClick={() =>
                setExpanded((current) =>
                  current.map((value, position) =>
                    position === index ? !value : value,
                  ),
                )
              }
            >
              {topic.title}
              <DownIcon />
            </button>
          </h3>
          <div
            className="preparation-panel"
            data-open={expanded[index]}
            id={`${id}-panel-${index}`}
            role="region"
            aria-labelledby={`${id}-button-${index}`}
            aria-hidden={!expanded[index]}
            inert={!expanded[index]}
          >
            <div>
              <p>{topic.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

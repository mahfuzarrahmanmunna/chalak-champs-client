import { Award, Download, Languages, List, Video } from 'lucide-react';
import React from 'react';

const IncludesCard = () => {
    return (
      <div
        className="rounded-lg p-6 shadow-sm border"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <h3
          className="text-xl font-bold mb-6"
          style={{ color: "var(--color-foreground)" }}
        >
          This course includes:
        </h3>
        <ul
          className="space-y-4 text-sm"
          style={{ color: "var(--color-foreground)", opacity: 0.8 }}
        >
          <li className="flex items-start gap-3">
            <Video
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--color-primary)" }}
            />
            <span>12 hours of video content</span>
          </li>
          <li className="flex items-start gap-3">
            <List
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--color-primary)" }}
            />
            <span>15 lessons</span>
          </li>
          <li className="flex items-start gap-3">
            <Download
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--color-primary)" }}
            />
            <span>Downloadable resources</span>
          </li>
          <li className="flex items-start gap-3">
            <Award
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--color-primary)" }}
            />
            <span>Certificate of completion</span>
          </li>
          <li className="flex items-start gap-3">
            <Languages
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--color-primary)" }}
            />
            <span>Subtitles: English, Spanish, French</span>
          </li>
        </ul>
      </div>
    );
};

export default IncludesCard;
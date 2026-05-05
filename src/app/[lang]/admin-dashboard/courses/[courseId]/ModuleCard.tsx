import React from "react";
import {
  ClockIcon,
  TrashIcon,
  PencilIcon,
  ChevronRightIcon,
} from "lucide-react";
import { format } from "date-fns";

interface Module {
  _id: string;
  title: string;
  description?: string;
  isPublished: boolean;
  scheduledPublishAt: string | null;
  thumbnail?: string;
  order: number;
}

interface ModuleCardProps {
  module: Module;
  colors: any;
  onDelete: () => void;
}

const ModuleCard = ({ module, colors, onDelete }: ModuleCardProps) => {
  const isScheduled =
    module.scheduledPublishAt &&
    new Date(module.scheduledPublishAt) > new Date();
  const isPublished = module.isPublished;

  return (
    <div
      className="p-5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-all hover:shadow-md"
      style={{
        backgroundColor: colors.card,
        borderColor: isScheduled ? colors.primary : colors.border,
      }}
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
          {module.thumbnail ? (
            <img
              src={module.thumbnail}
              alt="Module"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              No Img
            </div>
          )}
        </div>

        <div>
          <h3
            className="font-semibold text-lg"
            style={{ color: colors.foreground }}
          >
            {module.title}
          </h3>
          {module.description && (
            <p
              className="text-sm truncate max-w-md"
              style={{ color: colors.muted }}
            >
              {module.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm mt-1">
            {isPublished ? (
              <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-0.5 rounded-full text-xs font-medium">
                Published
              </span>
            ) : isScheduled ? (
              <span className="flex items-center gap-1 text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-xs font-medium">
                <ClockIcon className="w-3 h-3" />
                Scheduled:{" "}
                {format(
                  new Date(module.scheduledPublishAt!),
                  "MMM dd, hh:mm a",
                )}
              </span>
            ) : (
              <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">
                Draft
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-2 rounded-lg hover:bg-black hover:bg-opacity-5"
          style={{ color: colors.muted }}
          title="Edit"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-red-50"
          style={{ color: colors.destructive }}
          title="Delete"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-black hover:bg-opacity-5"
          style={{ color: colors.primary }}
          title="View Content"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ModuleCard;

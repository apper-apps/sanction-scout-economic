import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const EntityCard = ({ 
  entity, 
  onClick, 
  isSelected = false,
  className 
}) => {
  const getEntitySchema = (schema) => {
    const schemaMap = {
      "Person": { icon: "User", label: "Person", variant: "info" },
      "Organization": { icon: "Building2", label: "Organization", variant: "warning" },
      "Company": { icon: "Building", label: "Company", variant: "warning" },
      "LegalEntity": { icon: "Scale", label: "Legal Entity", variant: "secondary" },
      "Asset": { icon: "DollarSign", label: "Asset", variant: "success" },
      "Vehicle": { icon: "Car", label: "Vehicle", variant: "default" },
      "Vessel": { icon: "Ship", label: "Vessel", variant: "default" },
      "Aircraft": { icon: "Plane", label: "Aircraft", variant: "default" }
    };
    
    return schemaMap[schema] || { icon: "AlertCircle", label: schema, variant: "default" };
  };

  const entityType = getEntitySchema(entity.schema);
  const countries = entity.properties?.country || [];
  const aliases = entity.properties?.alias || [];
  const datasets = entity.datasets || [];

  const getRiskLevel = (datasets) => {
    const highRiskDatasets = ["sanctions", "pep", "crime"];
    const hasHighRisk = datasets.some(dataset => 
      highRiskDatasets.some(risk => dataset.toLowerCase().includes(risk))
    );
    
    if (hasHighRisk) return { level: "High", variant: "error" };
    if (datasets.length > 0) return { level: "Medium", variant: "warning" };
    return { level: "Low", variant: "success" };
  };

  const riskLevel = getRiskLevel(datasets);

  return (
    <div
      onClick={() => onClick(entity)}
      className={cn(
        "p-4 bg-surface border border-gray-700 rounded-sm cursor-pointer transition-all duration-200",
        "hover:border-gray-600 hover:bg-gray-800 hover:brightness-110",
        isSelected && "ring-2 ring-primary border-primary",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <ApperIcon name={entityType.icon} className="h-4 w-4 text-gray-400" />
          <Badge variant={entityType.variant} size="xs">
            {entityType.label}
          </Badge>
        </div>
        <Badge variant={riskLevel.variant} size="xs">
          {riskLevel.level} Risk
        </Badge>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-white text-lg leading-tight">
          {entity.caption}
        </h3>

        {aliases.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <ApperIcon name="User" className="h-3 w-3" />
            <span>AKA: {aliases.slice(0, 2).join(", ")}</span>
            {aliases.length > 2 && (
              <span className="text-accent">+{aliases.length - 2} more</span>
            )}
          </div>
        )}

        {countries.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <ApperIcon name="MapPin" className="h-3 w-3" />
            <span>{countries.slice(0, 2).join(", ")}</span>
            {countries.length > 2 && (
              <span className="text-accent">+{countries.length - 2} more</span>
            )}
          </div>
        )}

        {datasets.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <ApperIcon name="Database" className="h-3 w-3" />
            <span>Sources: {datasets.slice(0, 2).join(", ")}</span>
            {datasets.length > 2 && (
              <span className="text-accent">+{datasets.length - 2} more</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          ID: {entity.id}
        </div>
        <div className="flex items-center gap-1 text-xs text-accent">
          <span>View Details</span>
          <ApperIcon name="ChevronRight" className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
};

export default EntityCard;
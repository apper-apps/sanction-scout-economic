import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import sanctionsService from "@/services/api/sanctionsService";

const EntityDetails = ({ entityId, onClose }) => {
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (entityId) {
      loadEntityDetails();
    }
  }, [entityId]);

  const loadEntityDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await sanctionsService.getEntityDetails(entityId);
      setEntity(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadEntityDetails();
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  const renderPropertySection = (title, icon, values, formatter = null) => {
    if (!values || values.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ApperIcon name={icon} className="h-4 w-4 text-gray-400" />
          <h4 className="text-sm font-medium text-gray-300">{title}</h4>
        </div>
        <div className="pl-6 space-y-1">
          {values.map((value, index) => (
            <div key={index} className="text-sm text-white">
              {formatter ? formatter(value) : value}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed inset-y-0 right-0 w-full max-w-2xl bg-surface border-l border-gray-700 overflow-hidden z-50"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Entity Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>
          <Loading />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed inset-y-0 right-0 w-full max-w-2xl bg-surface border-l border-gray-700 overflow-hidden z-50"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Entity Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>
          <Error message={error} onRetry={handleRetry} />
        </div>
      </motion.div>
    );
  }

  if (!entity) return null;

  const entityType = getEntitySchema(entity.schema);
  const properties = entity.properties || {};

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed inset-y-0 right-0 w-full max-w-2xl bg-surface border-l border-gray-700 overflow-hidden z-50"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <ApperIcon name={entityType.icon} className="h-5 w-5 text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">Entity Details</h2>
              <Badge variant={entityType.variant} size="xs" className="mt-1">
                {entityType.label}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-white leading-tight">
                {entity.caption}
              </h1>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>ID: {entity.id}</span>
                <span>•</span>
                <span>Schema: {entity.schema}</span>
              </div>

              {entity.datasets && entity.datasets.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entity.datasets.map((dataset, index) => (
                    <Badge key={index} variant="secondary" size="xs">
                      {dataset}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Properties */}
            <div className="space-y-4">
              {renderPropertySection("Names", "User", properties.name)}
              {renderPropertySection("Aliases", "Users", properties.alias)}
              {renderPropertySection("Birth Dates", "Calendar", properties.birthDate, formatDate)}
              {renderPropertySection("Countries", "MapPin", properties.country)}
              {renderPropertySection("Addresses", "MapPin", properties.address)}
              {renderPropertySection("Notes", "FileText", properties.notes)}
              {renderPropertySection("Sanctions", "AlertTriangle", properties.sanctions)}
              {renderPropertySection("Programs", "Shield", properties.program)}
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-700 pt-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Metadata</h4>
              
              {entity.first_seen && (
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">First Seen:</span>
                  <span className="text-white">{formatDate(entity.first_seen)}</span>
                </div>
              )}

              {entity.last_seen && (
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Last Seen:</span>
                  <span className="text-white">{formatDate(entity.last_seen)}</span>
                </div>
              )}

              {entity.referents && entity.referents.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Link" className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Related Entities: {entity.referents.length}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EntityDetails;
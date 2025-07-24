import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header className="bg-surface border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-error rounded-sm">
              <ApperIcon name="Shield" className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sanction Scout</h1>
              <p className="text-xs text-gray-400">Global Sanctions Search</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Info" className="h-4 w-4" />
              About
            </Button>
            
            <a
              href="https://www.opensanctions.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ApperIcon name="ExternalLink" className="h-4 w-4" />
                OpenSanctions
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-700 bg-background"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-white mb-2">About Sanction Scout</h3>
                <p className="text-gray-400">
                  Professional sanctions screening tool powered by OpenSanctions API. 
                  Search global watchlists for compliance and due diligence.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-white mb-2">Data Sources</h3>
                <p className="text-gray-400">
                  Aggregated data from government sanctions lists, PEP databases, 
                  and other authoritative sources worldwide.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-white mb-2">Usage</h3>
                <p className="text-gray-400">
                  Enter names, organizations, or entities to search. Click results 
                  for detailed information including aliases and sanctions programs.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
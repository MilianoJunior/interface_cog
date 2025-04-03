import React from 'react';
import { AlertCircle, AlertTriangle, Activity } from 'lucide-react';

const StatusIndicator = ({ value, thresholds = { warning: 70, critical: 90 } }) => {
  if (value === null || value === undefined) return <AlertCircle className="text-gray-400" />;
  
  if (typeof value === 'number') {
    if (value >= thresholds.critical) {
      return <AlertTriangle className="text-red-500" />;
    } else if (value >= thresholds.warning) {
      return <AlertCircle className="text-yellow-500" />;
    } else {
      return <Activity className="text-green-500" />;
    }
  }
  return <Activity className="text-green-500" />;
};

export default StatusIndicator; 
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Award, Zap, X } from 'lucide-react';

export default function NotificationToast({ notification, onClose }) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'achievement':
        return <Award className="w-5 h-5" />;
      case 'points':
        return <Zap className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case 'achievement':
        return 'bg-yellow-500';
      case 'points':
        return 'bg-green-500';
      case 'success':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="toast"
      >
        <div className="flex items-center gap-3">
          <div className={`${getColor()} p-2 rounded-full text-white`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{notification.title}</div>
            {notification.message && (
              <div className="text-sm text-gray-600">{notification.message}</div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


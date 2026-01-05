    import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning'
}) {
  const variantStyles = {
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      confirmBtn: 'bg-amber-500 hover:bg-amber-600'
    },
    danger: {
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      confirmBtn: 'bg-red-500 hover:bg-red-600'
    },
    success: {
      icon: Check,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      confirmBtn: 'bg-emerald-500 hover:bg-emerald-600'
    }
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-sm bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`${style.iconBg} rounded-full p-3 mb-4`}>
                <Icon className={`w-8 h-8 ${style.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-slate-600 mb-6">{message}</p>
              
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 rounded-xl py-3 border-2"
                >
                  <X className="w-4 h-4 mr-2" />
                  {cancelText}
                </Button>
                <Button
                  onClick={onConfirm}
                  className={`flex-1 rounded-xl py-3 text-white ${style.confirmBtn}`}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
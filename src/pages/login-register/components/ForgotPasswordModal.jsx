import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ForgotPasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/?.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit(email);
      setIsSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg elevation-3 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {isSuccess ? 'Check Your Email' : 'Reset Password'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Mail" size={32} className="text-success" />
              </div>
              <div>
                <p className="text-foreground mb-2">Reset link sent!</p>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Check your inbox and follow the instructions to reset your password.
                </p>
              </div>
              <Button
                variant="default"
                onClick={handleClose}
                fullWidth
              >
                Got it
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Key" size={24} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e?.target?.value);
                  setError('');
                }}
                error={error}
                required
                disabled={isLoading}
              />

              <div className="flex space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  loading={isLoading}
                  iconName="Send"
                  iconPosition="left"
                  fullWidth
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AppointmentDetails = ({
  selectedAppointment,
  selectedSlot,
  onClose,
  onSave,
  onDelete,
  onReschedule
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(selectedAppointment || {});

  // Mock customer data
  const mockCustomer = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    totalBookings: 12,
    lastVisit: "2025-07-15",
    notes: "Prefers morning appointments. Has mild anxiety about dental procedures."
  };

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation', color: 'bg-blue-500' },
    { value: 'cleaning', label: 'Cleaning', color: 'bg-green-500' },
    { value: 'treatment', label: 'Treatment', color: 'bg-orange-500' },
    { value: 'emergency', label: 'Emergency', color: 'bg-red-500' },
    { value: 'followup', label: 'Follow-up', color: 'bg-purple-500' }
  ];

  const statusOptions = [
    { value: 'confirmed', label: 'Confirmed', color: 'text-success' },
    { value: 'pending', label: 'Pending', color: 'text-warning' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-destructive' },
    { value: 'completed', label: 'Completed', color: 'text-muted-foreground' }
  ];

  const handleSave = () => {
    onSave?.(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(selectedAppointment || {});
    setIsEditing(false);
  };

  if (!selectedAppointment && !selectedSlot) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center text-muted-foreground">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Selection</h3>
          <p className="text-sm">Select an appointment or time slot to view details</p>
        </div>
      </div>
    );
  }

  // Render for available slot (new appointment)
  if (selectedSlot && !selectedAppointment) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Plus" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">New Appointment</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="w-8 h-8"
          />
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="text-sm font-medium">Time Slot</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              {selectedSlot?.time} - {selectedSlot?.date?.toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-3">
            <Input
              label="Customer Name"
              placeholder="Enter customer name"
              required
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="customer@example.com"
            />
            
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
            />
            
            <Input
              label="Service Type"
              placeholder="e.g., Consultation, Cleaning"
            />
            
            <Input
              label="Duration (minutes)"
              type="number"
              value="60"
              min="15"
              max="240"
              step="15"
            />
            
            <Input
              label="Notes"
              placeholder="Any special requirements or notes"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              variant="default"
              iconName="Check"
              iconPosition="left"
              fullWidth
            >
              Book Appointment
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render for existing appointment
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Appointment Details</h3>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              iconName="Edit"
              onClick={() => setIsEditing(true)}
              className="w-8 h-8"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="w-8 h-8"
          />
        </div>
      </div>
      <div className="p-4 space-y-6">
        {/* Customer Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
            <Icon name="User" size={16} />
            <span>Customer Information</span>
          </h4>
          
          <div className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              {mockCustomer?.name?.split(' ')?.map(n => n?.[0])?.join('')}
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground">{mockCustomer?.name}</div>
              <div className="text-sm text-muted-foreground">{mockCustomer?.email}</div>
              <div className="text-sm text-muted-foreground">{mockCustomer?.phone}</div>
              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                <span>Total Bookings: {mockCustomer?.totalBookings}</span>
                <span>Last Visit: {mockCustomer?.lastVisit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
            <Icon name="Calendar" size={16} />
            <span>Appointment Details</span>
          </h4>
          
          {isEditing ? (
            <div className="space-y-3">
              <Input
                label="Title"
                value={editData?.title || selectedAppointment?.title}
                onChange={(e) => setEditData({...editData, title: e?.target?.value})}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Date"
                  type="date"
                  value={editData?.date || selectedAppointment?.date}
                  onChange={(e) => setEditData({...editData, date: e?.target?.value})}
                />
                
                <Input
                  label="Time"
                  type="time"
                  value={editData?.time || selectedAppointment?.time}
                  onChange={(e) => setEditData({...editData, time: e?.target?.value})}
                />
              </div>
              
              <Input
                label="Duration (minutes)"
                type="number"
                value={editData?.duration || selectedAppointment?.duration}
                onChange={(e) => setEditData({...editData, duration: parseInt(e?.target?.value)})}
                min="15"
                max="240"
                step="15"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Date & Time</div>
                <div className="font-medium text-foreground">
                  {selectedAppointment?.date} at {selectedAppointment?.time}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="font-medium text-foreground">
                  {selectedAppointment?.duration} minutes
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Service Type</div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${appointmentTypes?.find(t => t?.value === selectedAppointment?.type)?.color || 'bg-gray-500'}`} />
                  <span className="font-medium text-foreground capitalize">
                    {selectedAppointment?.type}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Status</div>
                <div className={`font-medium capitalize ${statusOptions?.find(s => s?.value === selectedAppointment?.status)?.color || 'text-foreground'}`}>
                  {selectedAppointment?.status}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
            <Icon name="FileText" size={16} />
            <span>Notes</span>
          </h4>
          
          {isEditing ? (
            <Input
              placeholder="Add notes about this appointment..."
              value={editData?.notes || mockCustomer?.notes}
              onChange={(e) => setEditData({...editData, notes: e?.target?.value})}
            />
          ) : (
            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
              {mockCustomer?.notes || "No notes available"}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2 pt-4 border-t border-border">
          {isEditing ? (
            <div className="flex space-x-2">
              <Button
                variant="default"
                iconName="Check"
                iconPosition="left"
                onClick={handleSave}
                fullWidth
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                fullWidth
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                iconName="Calendar"
                iconPosition="left"
                onClick={() => onReschedule?.(selectedAppointment)}
                fullWidth
              >
                Reschedule
              </Button>
              
              <Button
                variant="outline"
                iconName="MessageSquare"
                iconPosition="left"
                fullWidth
              >
                Send Message
              </Button>
              
              <Button
                variant="destructive"
                iconName="Trash2"
                iconPosition="left"
                onClick={() => onDelete?.(selectedAppointment)}
                fullWidth
              >
                Cancel Appointment
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Title, 
  Button, 
  ActionIcon, 
  Tooltip,
  Alert,
  Stack,
  Modal,
  TextInput,
  Select,
  Divider,
  Badge,
  SimpleGrid
} from '@mantine/core';
import { 
  IconPlus, 
  IconTrash, 
  IconAlertCircle,
  IconCreditCard,
  IconStar,
  IconStarFilled
} from '@tabler/icons-react';
import { useSubscription } from '@/services/subscription/SubscriptionProvider';

// Simple form validation without @mantine/form
interface PaymentMethodManagerProps {
  showTitle?: boolean;
}

interface PaymentMethodFormValues {
  cardNumber: string;
  cardName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  country: string;
  postalCode: string;
}

export function PaymentMethodManager({ showTitle = true }: PaymentMethodManagerProps) {
  const { 
    paymentMethods, 
    loading, 
    error, 
    addPaymentMethod, 
    removePaymentMethod,
    setDefaultPaymentMethodById,
    refreshPaymentMethods
  } = useSubscription();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formValues, setFormValues] = useState<PaymentMethodFormValues>({
    cardNumber: '',
    cardName: '',
    expiryMonth: new Date().getMonth() + 1,
    expiryYear: new Date().getFullYear(),
    cvv: '',
    country: 'US',
    postalCode: ''
  });
  
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PaymentMethodFormValues, string>>>({});

  // Handle form input changes
  const handleInputChange = (field: keyof PaymentMethodFormValues, value: string | number) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof PaymentMethodFormValues, string>> = {};
    
    if (formValues.cardNumber.length < 16) {
      errors.cardNumber = 'Card number must be at least 16 digits';
    }
    
    if (formValues.cardName.length < 3) {
      errors.cardName = 'Name on card is required';
    }
    
    if (!/^\d{3,4}$/.test(formValues.cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    if (formValues.postalCode.length < 3) {
      errors.postalCode = 'Postal code is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setProcessingPayment(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      // Determine card brand based on first digit
      let cardBrand = 'unknown';
      const firstDigit = formValues.cardNumber.charAt(0);
      if (firstDigit === '4') cardBrand = 'visa';
      else if (firstDigit === '5') cardBrand = 'mastercard';
      else if (firstDigit === '3') cardBrand = 'amex';
      else if (firstDigit === '6') cardBrand = 'discover';
      
      // Add the payment method
      await addPaymentMethod({
        type: 'card',
        details: {
          brand: cardBrand,
          last4: formValues.cardNumber.slice(-4),
          expMonth: formValues.expiryMonth,
          expYear: formValues.expiryYear
        },
        isDefault: paymentMethods.length === 0 // Make default if it's the first one
      });
      
      // Show success message and close modal
      setSuccessMessage('Payment method added successfully');
      setFormValues({
        cardNumber: '',
        cardName: '',
        expiryMonth: new Date().getMonth() + 1,
        expiryYear: new Date().getFullYear(),
        cvv: '',
        country: 'US',
        postalCode: ''
      });
      setModalOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to add payment method');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handle setting a payment method as default
  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethodById(paymentMethodId);
      setSuccessMessage('Default payment method updated');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to update default payment method');
    }
  };

  // Handle removing a payment method
  const handleRemove = async (paymentMethodId: string) => {
    try {
      await removePaymentMethod(paymentMethodId);
      setSuccessMessage('Payment method removed');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to remove payment method');
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refreshPaymentMethods();
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to refresh payment methods');
    }
  };

  // Get card icon based on brand
  const getCardIcon = (brand: string) => {
    return <IconCreditCard size={24} />;
  };

  return (
    <>
      <Card withBorder p="md" radius="md">
        {showTitle && (
          <Group justify="space-between" mb="md">
            <Title order={3}>Payment Methods</Title>
            <Button 
              variant="filled" 
              leftSection={<IconPlus size={16} />}
              onClick={() => setModalOpen(true)}
            >
              Add Payment Method
            </Button>
          </Group>
        )}

        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Error" 
            color="red" 
            mb="md"
          >
            {error.message}
          </Alert>
        )}

        {errorMessage && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Error" 
            color="red" 
            mb="md"
            onClose={() => setErrorMessage(null)}
            withCloseButton
          >
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert 
            title="Success" 
            color="green" 
            mb="md"
            onClose={() => setSuccessMessage(null)}
            withCloseButton
          >
            {successMessage}
          </Alert>
        )}

        {loading ? (
          <Text>Loading payment methods...</Text>
        ) : paymentMethods.length === 0 ? (
          <Stack align="center" py="xl">
            <IconCreditCard size={48} opacity={0.3} />
            <Text c="dimmed" ta="center">
              No payment methods found. Add a payment method to manage your subscription.
            </Text>
            {!showTitle && (
              <Button 
                variant="outline" 
                leftSection={<IconPlus size={16} />}
                onClick={() => setModalOpen(true)}
                mt="md"
              >
                Add Payment Method
              </Button>
            )}
          </Stack>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {paymentMethods.map((method) => (
              <Card key={method.id} withBorder p="md" radius="md">
                <Group justify="space-between">
                  <Group>
                    {getCardIcon(method.details?.brand || 'unknown')}
                    <div>
                      <Group gap={5}>
                        <Text fw={500}>
                          {method.details?.brand ? 
                            method.details.brand.charAt(0).toUpperCase() + method.details.brand.slice(1) : 
                            'Card'}
                        </Text>
                        {method.isDefault && (
                          <Badge color="blue" size="xs">Default</Badge>
                        )}
                      </Group>
                      <Text size="sm" c="dimmed">
                        •••• •••• •••• {method.details?.last4}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Expires {method.details?.expMonth}/{method.details?.expYear}
                      </Text>
                    </div>
                  </Group>
                  <Group gap={5}>
                    {!method.isDefault && (
                      <Tooltip label="Set as default">
                        <ActionIcon 
                          variant="subtle" 
                          onClick={() => handleSetDefault(method.id)}
                          color="blue"
                        >
                          <IconStar size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    {method.isDefault && (
                      <Tooltip label="Default payment method">
                        <ActionIcon 
                          variant="subtle"
                          color="blue"
                          disabled
                        >
                          <IconStarFilled size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    <Tooltip label="Remove">
                      <ActionIcon 
                        variant="subtle" 
                        color="red"
                        onClick={() => handleRemove(method.id)}
                        disabled={method.isDefault && paymentMethods.length > 1}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Card>

      <Modal 
        opened={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Add Payment Method"
        centered
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              leftSection={<IconCreditCard size={16} />}
              required
              value={formValues.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              error={formErrors.cardNumber}
            />
            
            <TextInput
              label="Name on Card"
              placeholder="John Doe"
              required
              value={formValues.cardName}
              onChange={(e) => handleInputChange('cardName', e.target.value)}
              error={formErrors.cardName}
            />
            
            <Group grow>
              <Select
                label="Expiry Month"
                placeholder="Month"
                data={Array.from({ length: 12 }, (_, i) => ({
                  value: (i + 1).toString(),
                  label: (i + 1).toString().padStart(2, '0')
                }))}
                required
                value={formValues.expiryMonth.toString()}
                onChange={(value) => handleInputChange('expiryMonth', parseInt(value || '1'))}
              />
              
              <Select
                label="Expiry Year"
                placeholder="Year"
                data={Array.from({ length: 10 }, (_, i) => ({
                  value: (new Date().getFullYear() + i).toString(),
                  label: (new Date().getFullYear() + i).toString()
                }))}
                required
                value={formValues.expiryYear.toString()}
                onChange={(value) => handleInputChange('expiryYear', parseInt(value || new Date().getFullYear().toString()))}
              />
            </Group>
            
            <TextInput
              label="CVV"
              placeholder="123"
              required
              value={formValues.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              error={formErrors.cvv}
            />
            
            <Select
              label="Country"
              placeholder="Select country"
              data={[
                { value: 'US', label: 'United States' },
                { value: 'CA', label: 'Canada' },
                { value: 'UK', label: 'United Kingdom' },
                { value: 'AU', label: 'Australia' },
                { value: 'DE', label: 'Germany' },
                { value: 'FR', label: 'France' },
              ]}
              required
              value={formValues.country}
              onChange={(value) => handleInputChange('country', value || 'US')}
            />
            
            <TextInput
              label="Postal Code"
              placeholder="12345"
              required
              value={formValues.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              error={formErrors.postalCode}
            />
            
            <Divider my="sm" />
            
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={processingPayment}>
                Add Payment Method
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
} 
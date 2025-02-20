import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface ConfigState {
  flight: {
    enabled: boolean;
    providers: string[];
  };
  hotel: {
    enabled: boolean;
    providers: string[];
  };
  car: {
    enabled: boolean;
    providers: string[];
  };
  stripe: {
    secretKey: string;
    webhookSecret: string;
  };
  providers: {
    amadeus: {
      clientId: string;
      clientSecret: string;
    };
    skyscanner: {
      apiKey: string;
    };
    serp: {
      apiKey: string;
    };
  };
}

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({ id, label, value, onChange }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
    </div>
  );
};

const Configuration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ConfigState>({
    flight: {
      enabled: false,
      providers: []
    },
    hotel: {
      enabled: false,
      providers: []
    },
    car: {
      enabled: false,
      providers: []
    },
    stripe: {
      secretKey: '',
      webhookSecret: ''
    },
    providers: {
      amadeus: {
        clientId: '',
        clientSecret: ''
      },
      skyscanner: {
        apiKey: ''
      },
      serp: {
        apiKey: ''
      }
    }
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/actions/get-config');
        const data = await response.json();
        if (data.success) {
          setConfig(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const validateConfig = (config: ConfigState) => {
    setError(null)
    if (
      config.flight.enabled &&
      config.flight.providers.length === 0
    ) {
      setError('Please select at least one flight provider');
      return false;
    }
    if (
      config.hotel.enabled &&
      config.hotel.providers.length === 0
    ) {
      setError('Please select at least one hotel provider');
      return false;
    }
    if (
      config.car.enabled &&
      config.car.providers.length === 0
    ) {
      setError('Please select at least one car provider');
      return false;
    }
    if (
      config.stripe.secretKey === '' ||
      config.stripe.webhookSecret === ''
    ) {
      setError('Please fill in all Stripe credentials');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setIsSaving(true);
    const isValid = validateConfig(config);
    if (!isValid) {
      setIsSaving(false);
      return;
    }
    try {
      const response = await fetch('/api/actions/update-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to update config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProviderToggle = (
    serviceType: 'flight' | 'hotel' | 'car',
    provider: string,
    checked: boolean
  ) => {
    setConfig(prev => ({
      ...prev,
      [serviceType]: {
        ...prev[serviceType],
        providers: checked
          ? [...prev[serviceType].providers, provider]
          : prev[serviceType].providers.filter(p => p !== provider)
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="sticky top-0 z-50 w-full bg-white border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-semibold">Configuration</h1>
          <div className="flex flex-col items-end gap-2">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-24"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                'Save'
              )}
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Services Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Flight Service */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Flight Service</Label>
                <p className="text-sm text-muted-foreground">Enable or disable flight booking service</p>
              </div>
              <Switch
                checked={config.flight.enabled}
                onCheckedChange={(checked) => setConfig(prev => ({
                  ...prev,
                  flight: { ...prev.flight, enabled: checked }
                }))}
              />
            </div>

            {config.flight.enabled && (
              <div className="space-y-4 pl-6">
                <Label>Select Providers</Label>
                <div className="space-y-2">
                  {['amadeus', 'skyscanner', 'direct'].map(provider => (
                    <div key={provider} className="flex items-center space-x-2">
                      <Switch
                        checked={config.flight.providers.includes(provider)}
                        onCheckedChange={(checked) => 
                          handleProviderToggle('flight', provider, checked)
                        }
                      />
                      <Label>{provider.charAt(0).toUpperCase() + provider.slice(1)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotel Service */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Hotel Service</Label>
                <p className="text-sm text-muted-foreground">Enable or disable hotel booking service</p>
              </div>
              <Switch
                checked={config.hotel.enabled}
                onCheckedChange={(checked) => setConfig(prev => ({
                  ...prev,
                  hotel: { ...prev.hotel, enabled: checked }
                }))}
              />
            </div>

            {config.hotel.enabled && (
              <div className="space-y-4 pl-6">
                <Label>Select Providers</Label>
                <div className="space-y-2">
                  {['serp', 'direct'].map(provider => (
                    <div key={provider} className="flex items-center space-x-2">
                      <Switch
                        checked={config.hotel.providers.includes(provider)}
                        onCheckedChange={(checked) => 
                          handleProviderToggle('hotel', provider, checked)
                        }
                      />
                      <Label>{provider.charAt(0).toUpperCase() + provider.slice(1)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Car Service */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Car Service</Label>
                <p className="text-sm text-muted-foreground">Enable or disable car rental service</p>
              </div>
              <Switch
                checked={config.car.enabled}
                onCheckedChange={(checked) => setConfig(prev => ({
                  ...prev,
                  car: { ...prev.car, enabled: checked }
                }))}
              />
            </div>

            {config.car.enabled && (
              <div className="space-y-4 pl-6">
                <Label>Select Providers</Label>
                <div className="space-y-2">
                  {['skyscanner', 'direct'].map(provider => (
                    <div key={provider} className="flex items-center space-x-2">
                      <Switch
                        checked={config.car.providers.includes(provider)}
                        onCheckedChange={(checked) => 
                          handleProviderToggle('car', provider, checked)
                        }
                      />
                      <Label>{provider.charAt(0).toUpperCase() + provider.slice(1)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Provider API Keys */}
            <Card>
              <CardHeader>
                <CardTitle>Provider API Keys</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amadeus */}
                {config.flight.providers.includes('amadeus') && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Amadeus</h3>
                    <div className="grid gap-4">
                      <PasswordInput
                        id="amadeus-client-id"
                        label="Client ID"
                        value={config.providers.amadeus.clientId}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          providers: {
                            ...prev.providers,
                            amadeus: {
                              ...prev.providers.amadeus,
                              clientId: e.target.value
                            }
                          }
                        }))}
                      />
                      <PasswordInput
                        id="amadeus-client-secret"
                        label="Client Secret"
                        value={config.providers.amadeus.clientSecret}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          providers: {
                            ...prev.providers,
                            amadeus: {
                              ...prev.providers.amadeus,
                              clientSecret: e.target.value
                            }
                          }
                        }))}
                      />
                    </div>
                  </div>
                )}

                {/* Skyscanner */}
                {(config.flight.providers.includes('skyscanner') || 
                  config.car.providers.includes('skyscanner')) && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Skyscanner</h3>
                    <PasswordInput
                      id="skyscanner-api-key"
                      label="API Key"
                      value={config.providers.skyscanner.apiKey}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        providers: {
                          ...prev.providers,
                          skyscanner: {
                            apiKey: e.target.value
                          }
                        }
                      }))}
                    />
                  </div>
                )}

                {/* SERP */}
                {config.hotel.providers.includes('serp') && (
                  <div className="space-y-4">
                    <h3 className="font-medium">SERP</h3>
                    <PasswordInput
                      id="serp-api-key"
                      label="API Key"
                      value={config.providers.serp.apiKey}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        providers: {
                          ...prev.providers,
                          serp: {
                            apiKey: e.target.value
                          }
                        }
                      }))}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stripe Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Stripe Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PasswordInput
                  id="stripe-secret-key"
                  label="Secret Key"
                  value={config.stripe.secretKey}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    stripe: { ...prev.stripe, secretKey: e.target.value }
                  }))}
                />
                <PasswordInput
                  id="stripe-webhook-secret"
                  label="Webhook Secret"
                  value={config.stripe.webhookSecret}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    stripe: { ...prev.stripe, webhookSecret: e.target.value }
                  }))}
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuration;
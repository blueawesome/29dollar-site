// src/components/VibeCustomizer.jsx
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { selectedVibe, customizationOptions, updateCustomization } from '../store/siteStore';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

// Mock sound function - we'll implement this properly later
const playSound = (type) => {
  console.log(`Playing sound: ${type}`);
};

export default function VibeCustomizer() {
  const $selectedVibe = useStore(selectedVibe);
  const $options = useStore(customizationOptions);
  
  // Initialize default options if not set
  useState(() => {
    if (!$options.playfulness) {
      updateCustomization({
        playfulness: 50,
        boldness: 50,
        minimalism: 50,
        nostalgia: 0
      });
    }
  });
  
  // Handle slider changes
  const handleSliderChange = (name, value) => {
    playSound('slide');
    updateCustomization({ [name]: value[0] });
  };
  
  // Handle vibe presets
  const selectVibePreset = (vibe) => {
    playSound('select');
    selectedVibe.set(vibe);
    
    // Set slider defaults based on vibe
    switch(vibe) {
      case 'playful':
        updateCustomization({
          playfulness: 90,
          boldness: 70,
          minimalism: 20,
          nostalgia: 30
        });
        break;
      case 'minimal':
        updateCustomization({
          playfulness: 10,
          boldness: 30,
          minimalism: 90,
          nostalgia: 0
        });
        break;
      case 'retro':
        updateCustomization({
          playfulness: 60,
          boldness: 50,
          minimalism: 10,
          nostalgia: 90
        });
        break;
      default:
        break;
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="vibes">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vibes">Vibe Presets</TabsTrigger>
            <TabsTrigger value="customize">Fine Tune</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vibes" className="pt-6">
            <div className="grid grid-cols-3 gap-3">
              {['playful', 'minimal', 'retro'].map(vibe => (
                <motion.div 
                  key={vibe}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectVibePreset(vibe)}
                  className={`
                    cursor-pointer rounded-lg p-4 text-center 
                    border-2 ${$selectedVibe === vibe ? 'border-primary' : 'border-transparent'}
                    ${vibe === 'playful' ? 'bg-pink-100' : 
                      vibe === 'minimal' ? 'bg-blue-50' : 
                      'bg-amber-100'}
                  `}
                >
                  <div className="text-3xl mb-2">
                    {vibe === 'playful' ? '😊' : 
                     vibe === 'minimal' ? '🧘' : 
                     '🕰️'}
                  </div>
                  <div className="font-medium">
                    {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="customize" className="space-y-6 pt-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Playfulness</label>
                <span className="text-sm text-muted-foreground">{$options.playfulness || 50}%</span>
              </div>
              <Slider
                defaultValue={[$options.playfulness || 50]}
                max={100}
                step={5}
                onValueChange={(value) => handleSliderChange('playfulness', value)}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Serious</span>
                <span>Playful</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Boldness</label>
                <span className="text-sm text-muted-foreground">{$options.boldness || 50}%</span>
              </div>
              <Slider
                defaultValue={[$options.boldness || 50]}
                max={100}
                step={5}
                onValueChange={(value) => handleSliderChange('boldness', value)}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Subtle</span>
                <span>Bold</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Minimalism</label>
                <span className="text-sm text-muted-foreground">{$options.minimalism || 50}%</span>
              </div>
              <Slider
                defaultValue={[$options.minimalism || 50]}
                max={100}
                step={5}
                onValueChange={(value) => handleSliderChange('minimalism', value)}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Detailed</span>
                <span>Minimal</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Nostalgia</label>
                <span className="text-sm text-muted-foreground">{$options.nostalgia || 0}%</span>
              </div>
              <Slider
                defaultValue={[$options.nostalgia || 0]}
                max={100}
                step={5}
                onValueChange={(value) => handleSliderChange('nostalgia', value)}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Modern</span>
                <span>Retro</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
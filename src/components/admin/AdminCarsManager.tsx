
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Car, Plus, Edit, Trash2, Upload } from "lucide-react";

interface CarData {
  id: string;
  make: string;
  model: string;
  production_start_year: number;
  production_end_year: number;
  price: number;
  image_url?: string;
  body_style: string;
  seating_capacity: number;
  engine_type: string;
  transmission_type: string;
  drivetrain: string;
  fuel_consumption: string;
  cargo_capacity: string;
  dimensions: string;
  category: string;
  created_at: string;
}

export function AdminCarsManager() {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    production_start_year: new Date().getFullYear(),
    production_end_year: new Date().getFullYear(),
    price: 0,
    image_url: '',
    body_style: 'Sedan',
    seating_capacity: 5,
    engine_type: 'Gasoline',
    transmission_type: 'Manual',
    drivetrain: 'FWD',
    fuel_consumption: '',
    cargo_capacity: '',
    dimensions: '',
    category: 'Compact',
  });

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cars"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadCarImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('cars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadCarImage(file);
    if (imageUrl) {
      setNewCar({ ...newCar, image_url: imageUrl });
    }
  };

  const handleEditImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingCar) return;

    const imageUrl = await uploadCarImage(file);
    if (imageUrl) {
      setEditingCar({ ...editingCar, image_url: imageUrl });
    }
  };

  const createCar = async () => {
    try {
      const { error } = await supabase
        .from('cars')
        .insert([newCar]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Car created successfully",
      });

      setNewCar({
        make: '',
        model: '',
        production_start_year: new Date().getFullYear(),
        production_end_year: new Date().getFullYear(),
        price: 0,
        image_url: '',
        body_style: 'Sedan',
        seating_capacity: 5,
        engine_type: 'Gasoline',
        transmission_type: 'Manual',
        drivetrain: 'FWD',
        fuel_consumption: '',
        cargo_capacity: '',
        dimensions: '',
        category: 'Compact',
      });

      fetchCars();
    } catch (error) {
      console.error('Error creating car:', error);
      toast({
        title: "Error",
        description: "Failed to create car"
      });
    }
  };

  const updateCar = async () => {
    if (!editingCar) return;

    try {
      const { error } = await supabase
        .from('cars')
        .update({
          make: editingCar.make,
          model: editingCar.model,
          production_start_year: editingCar.production_start_year,
          production_end_year: editingCar.production_end_year,
          price: editingCar.price,
          image_url: editingCar.image_url,
          body_style: editingCar.body_style,
          seating_capacity: editingCar.seating_capacity,
          engine_type: editingCar.engine_type,
          transmission_type: editingCar.transmission_type,
          drivetrain: editingCar.drivetrain,
          fuel_consumption: editingCar.fuel_consumption,
          cargo_capacity: editingCar.cargo_capacity,
          dimensions: editingCar.dimensions,
          category: editingCar.category,
        })
        .eq('id', editingCar.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Car updated successfully",
      });

      setEditingCar(null);
      fetchCars();
    } catch (error) {
      console.error('Error updating car:', error);
      toast({
        title: "Error",
        description: "Failed to update car"
      });
    }
  };

  const deleteCar = async (carId: string) => {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Car deleted successfully",
      });

      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
      toast({
        title: "Error",
        description: "Failed to delete car"
      });
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading) {
    return <div className="text-center">Loading cars...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Cars Management
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Car
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Car</DialogTitle>
                <DialogDescription>
                  Add a new car to the database
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      value={newCar.make}
                      onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={newCar.model}
                      onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_year">Start Year</Label>
                    <Input
                      id="start_year"
                      type="number"
                      value={newCar.production_start_year}
                      onChange={(e) => setNewCar({ ...newCar, production_start_year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_year">End Year</Label>
                    <Input
                      id="end_year"
                      type="number"
                      value={newCar.production_end_year}
                      onChange={(e) => setNewCar({ ...newCar, production_end_year: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newCar.price}
                      onChange={(e) => setNewCar({ ...newCar, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newCar.category} onValueChange={(value) => setNewCar({ ...newCar, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Compact">Compact</SelectItem>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                        <SelectItem value="Coupe">Coupe</SelectItem>
                        <SelectItem value="Convertible">Convertible</SelectItem>
                        <SelectItem value="Wagon">Wagon</SelectItem>
                        <SelectItem value="Pickup">Pickup</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="body_style">Body Style</Label>
                    <Select value={newCar.body_style} onValueChange={(value) => setNewCar({ ...newCar, body_style: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select body style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Coupe">Coupe</SelectItem>
                        <SelectItem value="Convertible">Convertible</SelectItem>
                        <SelectItem value="Wagon">Wagon</SelectItem>
                        <SelectItem value="Pickup">Pickup</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="seating_capacity">Seating Capacity</Label>
                    <Input
                      id="seating_capacity"
                      type="number"
                      min="2"
                      max="9"
                      value={newCar.seating_capacity}
                      onChange={(e) => setNewCar({ ...newCar, seating_capacity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="engine_type">Engine Type</Label>
                    <Select value={newCar.engine_type} onValueChange={(value) => setNewCar({ ...newCar, engine_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select engine type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gasoline">Gasoline</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="LPG">LPG</SelectItem>
                        <SelectItem value="CNG">CNG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transmission_type">Transmission</Label>
                    <Select value={newCar.transmission_type} onValueChange={(value) => setNewCar({ ...newCar, transmission_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                        <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="drivetrain">Drivetrain</Label>
                    <Select value={newCar.drivetrain} onValueChange={(value) => setNewCar({ ...newCar, drivetrain: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select drivetrain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FWD">Front-Wheel Drive (FWD)</SelectItem>
                        <SelectItem value="RWD">Rear-Wheel Drive (RWD)</SelectItem>
                        <SelectItem value="AWD">All-Wheel Drive (AWD)</SelectItem>
                        <SelectItem value="4WD">Four-Wheel Drive (4WD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fuel_consumption">Fuel Consumption</Label>
                    <Input
                      id="fuel_consumption"
                      placeholder="e.g., 7.5L/100km"
                      value={newCar.fuel_consumption}
                      onChange={(e) => setNewCar({ ...newCar, fuel_consumption: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cargo_capacity">Cargo Capacity</Label>
                    <Input
                      id="cargo_capacity"
                      placeholder="e.g., 500L"
                      value={newCar.cargo_capacity}
                      onChange={(e) => setNewCar({ ...newCar, cargo_capacity: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., 4500mm x 1800mm x 1450mm (L x W x H)"
                    value={newCar.dimensions}
                    onChange={(e) => setNewCar({ ...newCar, dimensions: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="car_image">Car Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="car_image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                  </div>
                  {newCar.image_url && (
                    <div className="mt-2">
                      <img 
                        src={newCar.image_url} 
                        alt="Car preview" 
                        className="w-32 h-24 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
                <Button onClick={createCar} disabled={uploading}>
                  Create Car
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Manage all cars in the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Years</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>
                  {car.image_url ? (
                    <img 
                      src={car.image_url} 
                      alt={`${car.make} ${car.model}`}
                      className="w-16 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <Car className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{car.make}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>
                  {car.production_start_year} - {car.production_end_year}
                </TableCell>
                <TableCell>{car.price.toLocaleString()} Da</TableCell>
                <TableCell>{car.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCar(car)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCar(car.id)}
                      className="bg-red-50 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={!!editingCar} onOpenChange={() => setEditingCar(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Car</DialogTitle>
              <DialogDescription>
                Update car information
              </DialogDescription>
            </DialogHeader>
            {editingCar && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_make">Make</Label>
                    <Input
                      id="edit_make"
                      value={editingCar.make}
                      onChange={(e) => setEditingCar({ ...editingCar, make: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_model">Model</Label>
                    <Input
                      id="edit_model"
                      value={editingCar.model}
                      onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_start_year">Start Year</Label>
                    <Input
                      id="edit_start_year"
                      type="number"
                      value={editingCar.production_start_year}
                      onChange={(e) => setEditingCar({ ...editingCar, production_start_year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_end_year">End Year</Label>
                    <Input
                      id="edit_end_year"
                      type="number"
                      value={editingCar.production_end_year}
                      onChange={(e) => setEditingCar({ ...editingCar, production_end_year: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_price">Price</Label>
                    <Input
                      id="edit_price"
                      type="number"
                      value={editingCar.price}
                      onChange={(e) => setEditingCar({ ...editingCar, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_category">Category</Label>
                    <Select value={editingCar.category} onValueChange={(value) => setEditingCar({ ...editingCar, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Compact">Compact</SelectItem>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                        <SelectItem value="Coupe">Coupe</SelectItem>
                        <SelectItem value="Convertible">Convertible</SelectItem>
                        <SelectItem value="Wagon">Wagon</SelectItem>
                        <SelectItem value="Pickup">Pickup</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit_body_style">Body Style</Label>
                    <Select value={editingCar.body_style} onValueChange={(value) => setEditingCar({ ...editingCar, body_style: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select body style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Coupe">Coupe</SelectItem>
                        <SelectItem value="Convertible">Convertible</SelectItem>
                        <SelectItem value="Wagon">Wagon</SelectItem>
                        <SelectItem value="Pickup">Pickup</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_seating_capacity">Seating Capacity</Label>
                    <Input
                      id="edit_seating_capacity"
                      type="number"
                      min="2"
                      max="9"
                      value={editingCar.seating_capacity}
                      onChange={(e) => setEditingCar({ ...editingCar, seating_capacity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_engine_type">Engine Type</Label>
                    <Select value={editingCar.engine_type} onValueChange={(value) => setEditingCar({ ...editingCar, engine_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select engine type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gasoline">Gasoline</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="LPG">LPG</SelectItem>
                        <SelectItem value="CNG">CNG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_transmission_type">Transmission</Label>
                    <Select value={editingCar.transmission_type} onValueChange={(value) => setEditingCar({ ...editingCar, transmission_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                        <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_drivetrain">Drivetrain</Label>
                    <Select value={editingCar.drivetrain} onValueChange={(value) => setEditingCar({ ...editingCar, drivetrain: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select drivetrain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FWD">Front-Wheel Drive (FWD)</SelectItem>
                        <SelectItem value="RWD">Rear-Wheel Drive (RWD)</SelectItem>
                        <SelectItem value="AWD">All-Wheel Drive (AWD)</SelectItem>
                        <SelectItem value="4WD">Four-Wheel Drive (4WD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_fuel_consumption">Fuel Consumption</Label>
                    <Input
                      id="edit_fuel_consumption"
                      placeholder="e.g., 7.5L/100km"
                      value={editingCar.fuel_consumption}
                      onChange={(e) => setEditingCar({ ...editingCar, fuel_consumption: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_cargo_capacity">Cargo Capacity</Label>
                    <Input
                      id="edit_cargo_capacity"
                      placeholder="e.g., 500L"
                      value={editingCar.cargo_capacity}
                      onChange={(e) => setEditingCar({ ...editingCar, cargo_capacity: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit_dimensions">Dimensions</Label>
                  <Input
                    id="edit_dimensions"
                    placeholder="e.g., 4500mm x 1800mm x 1450mm (L x W x H)"
                    value={editingCar.dimensions}
                    onChange={(e) => setEditingCar({ ...editingCar, dimensions: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_car_image">Car Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="edit_car_image"
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                  </div>
                  {editingCar.image_url && (
                    <div className="mt-2">
                      <img 
                        src={editingCar.image_url} 
                        alt="Car preview" 
                        className="w-32 h-24 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
                <Button onClick={updateCar} disabled={uploading}>
                  Update Car
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
            <DialogContent className="max-w-2xl">
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
          <DialogContent className="max-w-2xl">
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

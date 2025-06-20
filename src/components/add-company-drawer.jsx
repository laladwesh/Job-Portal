/* eslint-disable react/prop-types */

// UI imports for drawer, button, input
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Form validation (zod + react-hook-form)
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Custom hook for API calls
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";

// --------------------
// Validation Schema
// --------------------
const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only Images are allowed",
      }
    ),
});

// --------------------
// AddCompanyDrawer component
// --------------------
const AddCompanyDrawer = ({ fetchCompanies }) => {
  // Setup react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Setup for company creation API call
  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  // Handle form submission
  const onSubmit = async (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0], // Only send the first file
    });
  };

  // After adding a company, refresh company list
  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
    }
  }, [loadingAddCompany]);

  // Drawer UI for adding a new company
  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>
        <form className="flex gap-2 p-4 pb-0">
          {/* Company Name input */}
          <Input placeholder="Company name" {...register("name")} />

          {/* Company Logo input */}
          <Input
            type="file"
            accept="image/*"
            className=" file:text-gray-500"
            {...register("logo")}
          />

          {/* Add Button */}
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-40"
          >
            Add
          </Button>
        </form>
        <DrawerFooter>
          {/* Validation & error messages */}
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
          {errorAddCompany?.message && (
            <p className="text-red-500">{errorAddCompany?.message}</p>
          )}
          {/* Loader for API call */}
          {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7" />}
          {/* Cancel/close drawer button */}
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Field, FieldContent, FieldLabel, FieldGroup, FieldLegend, FieldSeparator, FieldError } from "../components/ui/field";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { NativeSelect } from "../components/ui/select";
import { toast } from "sonner"

import { useForm } from "@tanstack/react-form";

import { z } from "zod";

export interface ContactOption {
    label: string;
    value: string;
}



import type { Product } from "@/data/types";

// ... previous imports

export interface ContactUsProps {
    className?: string;
    interestOptions?: ContactOption[];
    productOptions?: Record<string, ContactOption[]>;
    productInquiry?: Product;
    hideTitle?: boolean;
}

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone: z.string().regex(/^\+?[1-9][0-9]{7,14}$/, "Invalid phone number").optional(),
    interest: z.string().optional(),
    product: z.string().optional(),
    message: z.string().optional(),
});


export function ContactUs({ className, interestOptions, productOptions, productInquiry, hideTitle }: ContactUsProps) {
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            interest: undefined as string | undefined,
            product: undefined as string | undefined,
            message: "",
        },
        validators: {
            onSubmit: contactSchema.safeParse,
        },
        onSubmit: async ({ value }) => {
            toast.success("Form submitted successfully!");
            form.reset();
        },
    });

    return (
        <Card className={`max-w-prose w-full shadow-none border-0 bg-base-100 ${className}`} >
            <CardHeader>
                {!hideTitle && <CardTitle>Contact Us</CardTitle>}
                <CardDescription>
                    {productInquiry
                        ? "Fill out the form below to inquire about this product."
                        : "Have a question or want to get in touch? Fill out the form below."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="flex flex-col gap-6"
                >
                    <div className="flex flex-wrap gap-4">
                        {/* NameField */}
                        <form.Field
                            name="name"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (<Field data-invalid={isInvalid} className="flex-1 min-w-[150px]">
                                    <FieldLabel>Name</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            placeholder="Your Name"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            autoComplete="off"
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        <FieldError errors={field.state.meta.errors} />
                                    </FieldContent>
                                </Field>)
                            }}
                        />
                        {/* EmailField */}
                        <form.Field
                            name="email"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (<Field data-invalid={isInvalid} className="flex-1 min-w-[150px]">
                                    <FieldLabel>Email</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            type="email"
                                            placeholder="Your Email"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            autoComplete="off"
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        <FieldError errors={field.state.meta.errors} />
                                    </FieldContent>
                                </Field>)
                            }}
                        />
                        {/* PhoneField */}
                        <form.Field
                            name="phone"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (<Field data-invalid={isInvalid} className="flex-1 min-w-[150px]">
                                    <FieldLabel>Phone <span className="text-muted-foreground font-normal text-xs">(Optional)</span></FieldLabel>
                                    <FieldContent>
                                        <Input
                                            type="tel"
                                            placeholder="Your Phone"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            autoComplete="off"
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        <FieldError errors={field.state.meta.errors} />
                                    </FieldContent>
                                </Field>)
                            }}
                        />
                    </div>

                    <FieldSeparator />

                    {/* Product Inquiry Context or Interest Selectors */}
                    {productInquiry ? (
                        <div className="bg-base-200 rounded-lg p-4 flex items-center gap-4">
                            <div className="h-16 w-16 bg-white rounded-md border p-1 shrink-0 overflow-hidden">
                                <img
                                    src={productInquiry.image}
                                    alt={productInquiry.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wider">{productInquiry.brand}</p>
                                <p className="font-medium text-base-content">{productInquiry.name}</p>

                            </div>
                        </div>
                    ) : (
                        <FieldGroup className="flex flex-col gap-2">
                            <FieldLegend className="mb-0">I'm interested in...</FieldLegend>

                            <div className="flex flex-wrap gap-4">
                                {interestOptions && (
                                    <form.Field
                                        name="interest"
                                        children={(field) => (
                                            <Field className="flex-1">
                                                <FieldContent>
                                                    <NativeSelect
                                                        className="w-full"
                                                        value={field.state.value}
                                                        onValueChange={(value: string) => {
                                                            field.handleChange(value);
                                                            form.setFieldValue("product", "all");
                                                        }}
                                                        placeholder="Select Interest"
                                                        options={interestOptions.map((option) => ({
                                                            value: option.value,
                                                            label: option.label,
                                                        }))}
                                                    />
                                                </FieldContent>
                                            </Field>
                                        )}
                                    />
                                )}

                                <form.Subscribe
                                    selector={(state) => state.values.interest}
                                    children={(interest) => {
                                        const currentProductOptions = interest && productOptions ? productOptions[interest] : undefined;

                                        if (!currentProductOptions) return null;

                                        return (
                                            <form.Field
                                                name="product"
                                                children={(field) => (
                                                    <Field className="flex-1">
                                                        <FieldContent>
                                                            <NativeSelect
                                                                className="w-full"
                                                                value={field.state.value}
                                                                onValueChange={field.handleChange}
                                                                options={[
                                                                    { value: "all", label: "All" },
                                                                    ...currentProductOptions.map((option) => ({
                                                                        value: option.value,
                                                                        label: option.label,
                                                                    })),
                                                                ]}
                                                            />
                                                        </FieldContent>
                                                    </Field>
                                                )}
                                            />
                                        );
                                    }}
                                />
                            </div>
                        </FieldGroup>
                    )}
                    <form.Field
                        name="message"
                        children={(field) => (
                            <Field>
                                <FieldLabel>Message</FieldLabel>
                                <FieldContent>
                                    <Textarea
                                        placeholder="How can we help you?"
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        autoComplete="off"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </FieldContent>
                            </Field>
                        )}
                    />
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                            <Button type="submit" disabled={!canSubmit} className="btn-primary w-full mt-2 mb-4">
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        )}
                    />
                </form>
            </CardContent>
        </Card>
    );
}



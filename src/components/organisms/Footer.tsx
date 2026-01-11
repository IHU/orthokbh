import {
  HomePropertiesModel,
  IApiContentModelBase,
  Umbraco_Cms_Core_Models_DeliveryApi_ApiLink,
  Umbraco_Cms_Core_Models_DeliveryApi_IApiContent,
} from "@ihu/umbraco-components/dist/api/umbraco";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export interface FooterProps {
  className?: string;
  copyright?: string;
  links?: Umbraco_Cms_Core_Models_DeliveryApi_IApiContent[];
  quickLinks?: Umbraco_Cms_Core_Models_DeliveryApi_ApiLink[];
  workingHoursExtended?: string[];
  address: string;
  postalCode?: string;
  city?: string;
  email?: string;
  phone?: string;
  footerBottomBarLinks: Umbraco_Cms_Core_Models_DeliveryApi_ApiLink[];
  properties: HomePropertiesModel;
}

export const Footer: React.FC<FooterProps> = ({
  className = "",
  copyright = `© ${new Date().getFullYear()} All rights reserved`,
  links = [],
  quickLinks = [],
  workingHoursExtended = [],
  address,
  postalCode,
  city,
  email,
  phone,
  footerBottomBarLinks = [],
  properties,
}) => {
  return (
    <footer
      className={`py-10 bg-background border-t text-foreground font-body ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Address + Member Section */}
          <div className="space-y-3">
            <h4 className="font-headline text-lg font-bold mb-2">Address</h4>
            <div className="flex items-center gap-2 text-base">
              <MapPin className="h-5 w-5 text-primary" />
              <span>
                {address} {postalCode} {city}
              </span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Phone className="h-5 w-5 text-primary" />
              <span>{phone} </span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Mail className="h-5 w-5 text-primary" />
              <span>{email}</span>
            </div>
            {/* Member Section */}
            <div className="mt-10">
              <div className="flex items-center">
                <Image
                  src="https://mediebibliotek.cancer.dk/transform/fccc73bb-afbb-49d1-9b2e-775422a80277/KC_FRIVILLIGE_VISTOETTER_RGB"
                  alt="Medlem af logo"
                  className="h-24 w-auto object-contain"
                  width={150}
                  height={50}
                />
              </div>
            </div>
          </div>

          {/* Treatments */}
          <div>
            <h4 className="font-headline text-lg font-bold mb-2">
              Technologies/Platforms
            </h4>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <Link href={link.route.path ?? "#"}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Information */}
          <div>
            <h4 className="font-headline text-lg font-bold mb-2">Legal</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <Link href={link.route?.path ?? "#"}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours & Phone Hours */}
          <div>
            <h4 className="font-headline text-lg font-bold mb-2">
              Simple Digital Experiences
            </h4>
            <ul className="space-y-1">
              {workingHoursExtended && workingHoursExtended.length > 0 ? (
                workingHoursExtended.map((workingHour, index) => {
                  const [day, time] = workingHour.split("##");
                  return (
                    <li key={index.toString()} className="flex justify-between">
                      <span>{day}</span> <span>{time}</span>
                    </li>
                  );
                })
              ) : properties?.workingHours &&
                properties.workingHours.length > 0 ? (
                properties.workingHours
                  .split(/\r?\n|,/) // split by newline or comma
                  .map((workingHour, index) => {
                    const [day, time] = workingHour.split("##");
                    return (
                      <li
                        key={index.toString()}
                        className="flex justify-between"
                      >
                        <span>{day}</span> <span>{time}</span>
                      </li>
                    );
                  })
              ) : (
                <li className="text-muted-foreground italic">
                  Ingen åbningstider tilgængelige
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-2">
          <div className="flex flex-col items-start md:items-start">
            <div>{copyright}</div>
            <div>
              Developed by{" "}
              <a
                href="https://uslu.dk"
                className="text-primary hover:underline"
              >
                USLU
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            {footerBottomBarLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url ?? "#"}
                className="hover:underline"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

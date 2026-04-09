import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import ProfileSection from "@/components/theme/1/ProfileSection";
import OpeningSection from "@/components/theme/1/OpeningSection";
import CountdownTimer from "@/components/countdown-timer";
import QuoteSection from "@/components/theme/1/QuoteSection";
import InvitationTextSection from "@/components/theme/1/InvitationTextSection";
import FamilySection from "@/components/theme/1/FamilySection";
import EventSection from "@/components/theme/1/EventSection";
import GallerySection from "@/components/theme/1/GallerySection";
import BankSection from "@/components/theme/1/BankSection";
import RsmpSection from "@/components/theme/1/rsmpsection";
import ClosingSection from "@/components/theme/1/ClosingSection";
import FooterSection from "@/components/theme/1/FooterSection";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "eeX5G1bG7CodrjaV5Akbj9",
      token:
        "USLqyn7tsq53IIOTOT8HptiIcuGWKsrvuIbdNFZpZ9mvVwXPxhOJQoNOXIrTUJkIxMZnPOSBrb9zrxNeYzA",
    },
  ],
  // preview: true → selalu fetch revisi terbaru (termasuk yang belum dipublish)
  // Ganti ke false saat production jika ingin hanya render yang sudah dipublish
  preview: process.env.NODE_ENV === "development",
});

// Register custom components to be used in Plasmic Studio
PLASMIC.registerComponent(ProfileSection, {
  name: "ProfileSection",
  props: {
    gallery: "object",
    defaultBgImage1: "string",
    opening: "object",
    theme: "object",
    waktu_acara: "string",
    event: "object",
    childrenData: "object",
    isWedding: "boolean",
    minHeight: "string",
    topLeftDecoration: "string",
    topRightDecoration: "string",
    bottomLeftDecoration: "string",
    bottomRightDecoration: "string",
    specialFontFamily: "string",
    BodyFontFamily: "string",
    HeadingFontFamily: "string",
  },
});

PLASMIC.registerComponent(OpeningSection, {
  name: "OpeningSection",
  props: {
    opening: "object",
    gallery: "object",
    decorations: "object",
    theme: "object",
    isWedding: "boolean",
    childrenData: "object",
    onOpen: "event",
    onShowQr: "event",
    specialFontFamily: "string",
    BodyFontFamily: "string",
    HeadingFontFamily: "string",
    plugin: "object",
    category_type: "object",
  },
});

PLASMIC.registerComponent(CountdownTimer, {
  name: "CountdownTimer",
  props: {
    targetDate: "string",
    accentColor: "string",
    containerClassName: "string",
    numberClassName: "string",
    labelClassName: "string",
  },
});

PLASMIC.registerComponent(QuoteSection, {
  name: "QuoteSection",
  props: {
    quote: "string",
    theme: "object",
    specialFontFamily: "string",
    BodyFontFamily: "string",
    HeadingFontFamily: "string",
  },
});

PLASMIC.registerComponent(InvitationTextSection, {
  name: "InvitationTextSection",
  props: {
    invitation: "string",
    theme: "object",
  },
});

PLASMIC.registerComponent(FamilySection, {
  name: "FamilySection",
  props: {
    childrenData: "object",
    parents: "object",
    isWedding: "boolean",
    theme: "object",
    category_type: "object",
  },
});

PLASMIC.registerComponent(EventSection, {
  name: "EventSection",
  props: {
    events: "object",
    sectionTitle: "string",
    theme: "object",
    specialFontFamily: "string",
  },
});

PLASMIC.registerComponent(GallerySection, {
  name: "GallerySection",
  props: {
    gallery: "object",
    theme: "object",
  },
});

PLASMIC.registerComponent(BankSection, {
  name: "BankSection",
  props: {
    theme: "object",
    specialFontFamily: "string",
    bodyFontFamily: "string",
    bankTransfer: "object",
    contentUserId: "number",
    status: "string",
  },
});

PLASMIC.registerComponent(RsmpSection, {
  name: "RsmpSection",
  props: {
    theme: "object",
    specialFontFamily: "string",
    bodyFontFamily: "string",
    contentUserId: "number",
    plugin: "object",
    status: "string",
  },
});

PLASMIC.registerComponent(ClosingSection, {
  name: "ClosingSection",
  props: {
    gallery: "object",
    childrenData: "object",
    specialFontFamily: "string",
    BodyFontFamily: "string",
    HeadingFontFamily: "string",
    defaultBgImage1: "string",
    category_type: "object",
  },
});

PLASMIC.registerComponent(FooterSection, {
  name: "FooterSection",
  props: {
    textColor: "string",
  },
});

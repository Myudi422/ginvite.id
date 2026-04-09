// ThemeWrapper: pilih komponen tema berdasarkan themeId / categoryId
// Mendukung tema 1–7

import { ThemeData } from "@/lib/theme-data";
import Theme1 from "@/components/theme/1/page";
import Theme2 from "@/components/theme/2/page";
import Theme3 from "@/components/theme/3/page";
import Theme4 from "@/components/theme/4/page";
import Theme5 from "@/components/theme/5/page";
import Theme6 from "@/components/theme/6/page";
import Theme7 from "@/components/theme/7/page";

interface ThemeWrapperProps {
  data: ThemeData;
  themeId?: string | number;
}

export default function ThemeWrapper({ data, themeId }: ThemeWrapperProps) {
  switch (themeId?.toString()) {
    case '1':
      return <Theme1 data={data} />;
    case '2':
      return <Theme2 data={data} />;
    case '3':
      return <Theme3 data={data} />;
    case '4':
      return <Theme4 data={data} />;
    case '5':
      return <Theme5 data={data} />;
    case '6':
      return <Theme6 data={data} />;
    case '7':
      return <Theme7 data={data} />;
    default:
      // Fallback ke tema 1
      return <Theme1 data={data} />;
  }
}
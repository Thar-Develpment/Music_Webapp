import { redirect } from "next/navigation";

export default function HomeExtrasRedirectPage() {
  redirect("/admin/enquiries");
}

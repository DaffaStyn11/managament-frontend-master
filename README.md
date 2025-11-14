import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardAction, CardFooter, CardDescription} from "@/components/ui/card";
import { title } from "process";

export default function Home() {
  // const items = [
  //   { aspect: "aspect-video", color: "bg-gray-100" },
  //   { aspect: "aspect-video", color: "bg-gray-100" },
  //   { aspect: "aspect-video", color: "bg-gray-100" },
  //   { aspect: "aspect-video", color: "bg-gray-100" },
  //   { aspect: "aspect-video", color: "bg-gray-100" },
  //   { aspect: "aspect-video", color: "bg-gray-100" },
  //   { aspect: "aspect-video", color: "bg-gray-100" },
  //   { aspect: "aspect-video", color: "bg-gray-100" },
  //   { aspect: "aspect-video", color: "bg-gray-100" },
  //   { aspect: "aspect-video", color: "bg-gray-100" },
  // ];

  // return (
  //   <div className="grid grid-cols-10 gap-7">
  //     {items.map((item, i) => (
  //       <div key={i} className={`${item.aspect} ${item.color}`}></div>
  //     ))}
  //   </div>
  // );

//   return(
// <div className="grid grid-cols-3 gap-4">
//   {Array.from({ length: 3}).map((_, i) => (<div key={i} className="aspect-square bg-gray-200"></div>))}
// </div>
//   );

const items = Array.from({length: 10 }, (_, i) => ({
 title: `Judul Card ${i + 1}`,
 descriptions: `deskripis Card ${i + 1}`,
 content:  `Konten Card ${i + 1}`,
}))

return(


<div className="grid grid-cols-3 gap-4">
  {items.map((item, i) => (
  <Card key={i}>
  <CardHeader>
    <CardTitle>{item.title}</CardTitle>
    <CardDescription>{item.descriptions}</CardDescription>
  </CardHeader>
  <CardContent>
    <p>{item.content}</p>
  </CardContent>
</Card>
  ))}
</div>
)
}

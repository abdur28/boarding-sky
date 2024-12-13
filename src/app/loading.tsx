import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-20 w-20 animate-spin text-first" />
      </div> 
    </div>
  );
};

export default Loading;

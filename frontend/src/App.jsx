import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [videoData, setVideoData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    console.log("analysixing");

    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/scrape-playlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playlistUrl }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch playlist data");
      }

      const data = await response.json();
      console.log(data);
      setVideoData(data.videoList);
      setGraphData(data.graphData);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    } else {
      return views.toString();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-slate-700 sticky top-0 left-0 w-full z-50">
        <nav className="flex justify-between items-center text-neutral-200">
          <img
            src="./public/logo.webp"
            alt=""
            className="w-36 h-20 object-contain p-4"
          />
          <ul className="flex space-x-16 p-4">
            <li className="hover:text-white transition-colors cursor-pointer">
              Home
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              About
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Contact
            </li>
          </ul>
        </nav>
      </div>
      <Card className="">
        <CardHeader>
          <CardTitle>YouTube Playlist Analyzer</CardTitle>
          <CardDescription className="font-mono pt-2">
            Enter a YouTube playlist URL to analyze its videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder="Enter YouTube playlist URL"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Analyze Playlist"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {videoData.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="h-[500px] overflow-y-auto">
            <CardHeader>
              <CardTitle>Video List</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {videoData.map((video, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <span className="font-bold text-lg min-w-[24px]">
                      {index + 1}.
                    </span>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-24 h-auto"
                    />
                    <div>
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-600">
                        {formatViews(video.views)} views
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">View Count Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default App;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, TrendingUp, Users } from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppContext } from "../../contexts/AppContext";

export default function AnalyticsPanel() {
  const { forms, applications } = useAppContext();

  const totalForms = forms.length;
  const totalApplications = applications.length;

  const statusCounts = {
    applied: applications.filter((a) => a.status === "applied").length,
    under_review: applications.filter((a) => a.status === "under_review")
      .length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    draft: applications.filter((a) => a.status === "draft").length,
  };

  const statusData = [
    { name: "Applied", value: statusCounts.applied, color: "#2196F3" },
    {
      name: "Under Review",
      value: statusCounts.under_review,
      color: "#FF9800",
    },
    { name: "Approved", value: statusCounts.approved, color: "#4CAF50" },
    { name: "Rejected", value: statusCounts.rejected, color: "#F44336" },
    { name: "Draft", value: statusCounts.draft, color: "#9E9E9E" },
  ];

  const topForms = [...forms]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Forms",
            value: totalForms,
            icon: FileText,
            color: "#1565C0",
            bg: "#E3F2FD",
          },
          {
            label: "Applications",
            value: totalApplications,
            icon: BarChart3,
            color: "#2E7D32",
            bg: "#E8F5E9",
          },
          {
            label: "Approved",
            value: statusCounts.approved,
            icon: TrendingUp,
            color: "#4CAF50",
            bg: "#E8F5E9",
          },
          {
            label: "Under Review",
            value: statusCounts.under_review,
            icon: Users,
            color: "#E65100",
            bg: "#FFF3E0",
          },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: metric.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: metric.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-gray-900">
                      {metric.value}
                    </p>
                    <p className="text-xs text-gray-500">{metric.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by status chart */}
        <Card className="border-0 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">
              Applications by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={statusData}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry) => (
                    <Cell key={entry.color} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 5 most viewed forms */}
        <Card className="border-0 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">
              Top 5 Most Viewed Forms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topForms.map((form, index) => (
                <div key={form.id} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-nf-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-nf-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {form.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div
                        className="h-1.5 rounded-full bg-nf-primary/20"
                        style={{
                          width: `${Math.min(100, (form.viewCount / topForms[0].viewCount) * 100)}%`,
                        }}
                      >
                        <div
                          className="h-full rounded-full bg-nf-primary"
                          style={{
                            width: `${Math.min(100, (form.viewCount / topForms[0].viewCount) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {form.viewCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

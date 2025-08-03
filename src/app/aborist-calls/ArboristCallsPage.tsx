"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/Aborist/CardList";
import { Badge } from "@/components/UI/Aborist/BadgeList";
import { Button } from "@/components/UI/Aborist/ButtonList";
import { Input } from "@/components/UI/Aborist/InputList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/Aborist/SelectList";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/Aborist/TableList";
import { FileText, XIcon, Video, TreePine, Users, Search } from "lucide-react";
import { useState } from "react";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import { arboristCalls } from "@/constants/arboristCalls";

export const metadata: Metadata = genMetadata({
  title: "ZecHub Aborist Calls",
  url: "https://zechub.wiki/aborist-calls",
});

export default function ArboristCallsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const filteredCalls = arboristCalls.filter((call) => {
    const matchesSearch =
      call.id.toString().includes(searchTerm) ||
      call.date.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || call.status.toLowerCase() === statusFilter;

    const callYear = call.date.includes("2025") ? "2025" : "2024";
    const matchesYear = yearFilter === "all" || callYear === yearFilter;

    return matchesSearch && matchesStatus && matchesYear;
  });

  const LinkButton = ({
    href,
    icon: Icon,
    children,
    className = "",
  }: {
    href: string;
    icon: any;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Button
      size="sm"
      variant="ghost"
      className={`h-8 px-2 text-xs ${className}`}
      onClick={() => window.open(href, "_blank")}
    >
      <Icon className="h-3 w-3 mr-1" />
      {children}
    </Button>
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-3xl font-bold">Zcash Arborist Calls</h1>
          </div>
          <p className="text-gray-600">
            Complete archive of all Zcash community arborist calls
          </p>
        </div>

        {/* Stats and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Stats */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Calls
                  </p>
                  <p className="text-2xl font-bold">{arboristCalls.length}</p>
                </div>
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Call # or date..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-yellow-300 dark:bg-yellow-500">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-yellow-300 dark:bg-yellow-500">
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredCalls.length} of {arboristCalls.length} calls
          </p>
        </div>

        {/* Calls Table */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Arborist Calls Archive</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20 font-semibold">Call #</TableHead>
                    <TableHead className="w-32 font-semibold">Date</TableHead>
                    <TableHead className="w-20 font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Resources</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCalls.map((call) => (
                    <TableRow
                      key={call.id}
                      className="hover:bg-yellow-300 dark:hover:bg-yellow-500"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          #{call.id}
                          {call.id === 100 && (
                            <span className="text-lg">🎉</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {call.date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 text-xs"
                        >
                          {call.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {call.notes && (
                            <LinkButton
                              href={call.notes}
                              icon={FileText}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              Notes
                            </LinkButton>
                          )}
                          {call.video && (
                            <LinkButton
                              href={call.video}
                              icon={Video}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              Video
                            </LinkButton>
                          )}
                          {call.twitter && (
                            <LinkButton
                              href={call.twitter}
                              icon={XIcon}
                              className="text-black-500 hover:text-black hover:bg-blue-50"
                            >
                              Twitter
                            </LinkButton>
                          )}
                          {call.agenda && (
                            <LinkButton
                              href={call.agenda}
                              icon={FileText}
                              className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                            >
                              Agenda
                            </LinkButton>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500">
          <p className="flex items-center justify-center gap-2 text-sm">
            <TreePine className="h-4 w-4" />
            Zcash Community Arborist Calls Archive
          </p>
        </div>
      </div>
    </div>
  );
}

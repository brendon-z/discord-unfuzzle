using System;
using System.Linq;
using System.Collections.Generic;
using System.IO;

namespace Program.Tests
{
    public class Program
    {
        // args capture the commandline arguments
        public void ProgramMain(string[] args)
        {
            var output = new List<string>();
            Dictionary<string, Stack<(string, int)>> register = new Dictionary<string, Stack<(string, int)>>();
            Dictionary<string, int> count = new Dictionary<string, int>();
            Dictionary<string, int> elapsed = new Dictionary<string, int>();


            var lines = File.ReadLines(args[1]);

            foreach (var line in lines) {
                string[] keywords = line.Split(' ');

                if (keywords.Length != 3) {
                    Console.WriteLine("Malformed line!");
                } else {
                    if (count.ContainsKey(keywords[2])) {
                        count[keywords[2]] += 1;
                    } else {
                        count.Add(keywords[2], 1);
                    }

                    if (register.ContainsKey(keywords[2])) {
                        var currTag = register[keywords[2]].Peek();
                        Console.WriteLine(currTag.Item1 + " " + currTag.Item2);
                        if ((currTag.Item1 == "begin" && keywords[1] == "begin") || (currTag.Item1 == "end" && keywords[1] == "end")) {
                            Console.WriteLine("Duplicate tag!");
                        } else {
                            if (currTag.Item1 == "begin") {
                                register[keywords[2]].Pop();
                                if (elapsed.ContainsKey(currTag.Item1)) {
                                    elapsed[keywords[2]] += Convert.ToInt32(keywords[0]) - currTag.Item2;
                                } else {
                                    elapsed[keywords[2]] = Convert.ToInt32(keywords[0]) - currTag.Item2;
                                }
                            } else {
                                register[keywords[2]].Push(("begin", Convert.ToInt32(keywords[1])));
                            }
                        }
                    } else {
                        register[keywords[2]] = new Stack<(string, int)>();
                        register[keywords[2]].Push(("begin", Convert.ToInt32(keywords[1])));
                    }
                }
            }

            foreach(KeyValuePair<string, int> entry in elapsed) {
                output.Add(entry.Key + " " + entry.Value);
            }

            string mostFrequentTag = "";
            int maxFreq = 0;

            foreach(KeyValuePair<string, int> entry in count) {
                if (entry.Value >= maxFreq) {
                    if (entry.Value == maxFreq && String.Compare(entry.Key, mostFrequentTag) > 0) {
                        continue;
                    }
                    mostFrequentTag = entry.Key;
                }
            }

            output.Add(mostFrequentTag);

            using (StreamWriter outputFile = new StreamWriter(args[3])) {
                foreach (string line in output) {
                    outputFile.WriteLine(line);
                }
            }
        }
    }
}


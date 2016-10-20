var es_queries = {
  "default_yr_interval_words"  : {
        "size": 0,
        "query": {
        "bool": {
          "must_not": [
            {"terms": {
              "word": [
                "africa",
                "conflict",
                "peace",
                "war",
                "impact",
                "causes",
                "reason",
                "study",
                "e280a6",
                "african",
                "role",
                "violence",
                "process",
                "case",
                "review",
                "du",
                "asia",
                "end",
                "afro",
                "article",
                "sub",
                "development",
                "evidence",
                "university",
                "management",
                "effect",
                "pp",
                "quot",
                "york",
                "american",
                "world",
                "research",
                "gulf"
              ]
            }},
            {
              "term": {
                "pos": {
                  "value": "nnp"
                }
              }
            }
          ]
        }
      },
        "aggs" : {
          "years" : {
            "histogram": {
              "field": "yr",
              "interval": 5,
              "order": {
                "_key": "desc"
              }
            },
            "aggs": {
              "words": {
                "terms": {
                  "field": "word",
                  "order" : { "sum_v" : "desc" },
                  "size": 100
                },
                "aggs" : {
                  "sum_v" : { "sum" : { "field" : "scoreVal"}}
                }
              }
            }
          }
        }
  },
  "default_word_headlines_yr" : {
              "size": 1000,
              "query": {
                "bool": {
                  "must": [
                    {
                      "range": {
                        "yr": {
                          "gte": 1970,
                          "lte": 1975
                        }
                      }
                    },
                    {
                      "term": {
                        "new": {
                          "value": "race"
                        }
                      }
                    }
                  ]
                }
              }
            }
}

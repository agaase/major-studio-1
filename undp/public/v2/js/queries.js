var es_queries = {
 "default_country_yr_conflicts" : {
    "size": 10000,
    "query": {
        "bool": {
          "must": [
            {"range": {
              "year": {
                "gte": 1990,
                "lte": 1994
              }
            }},
            {
              "term": {
                "country": {
                  "value": "Rwanda"
                }
              }
            }
          ]
        }
    }
  },

 "sequence_countries" : {
    "size": 0,
    "query": {
        "match_all": {}
    },
    "aggs": {
        "countries": {
          "terms": {
            "field": "country",
            "size": 500,
            "order" : { "sum_f" : "desc" }
          },
          "aggs" : {
            "sum_f" : { "sum" : { "field" : "best_est"}}
          }
        }
      }
  },
  "sequence_dyads" :{
    "size" : 0,
    "query": {
      "bool": {
        "must": [
          {"range": {
            "year": {
              "gte": 1989,
              "lte": 2015
            }
          }},
          {
            "terms": {
              "type_of_conflict": [
                1,2,3
              ]
            }
          }
        ]
      }
    },
    "aggs": {
      "dyads": {
        "terms": {
          "field": "d_id",
          "size": 5,
          "order" : { "sum_f" : "desc" },
          "min_doc_count": 75
        },
        "aggs" : {
          "sum_f" : { "sum" : { "field" : "best_est"}}
        }
      }
    }
  },
  "dyad_conflicts" : {
    "size" : 5000,
    "query": {
      "filtered": {
        "filter": {
          "term": {
            "d_id": "12046"
          }
        }
      }
    }
  },
 "default_conflicts_percountry_peryear" : {
    "size": 0,
    "query": {
        "match_all": {}
    }, 
    "aggs": {
      "country-year": {
        "terms": {
          "field": "year",
          "size": 100
        },
        "aggs": {
          "country": {
            "terms": {
              "field": "country",
              "size": 100,
              "order" : { "sum_f" : "desc" }
            },
            "aggs" : {
              "sum_f" : { "sum" : { "field" : "best_est"}}
            }
          }
        }
        
      }
    }
  },
   "unemployment_data" : {
    "size" : 0,
    "query": {
      "match_all" : {}
    },
    "aggs": {
      "by_year": {
        "terms": {
          "field": "yr",
          "size": 100
        },
        "aggs" : {
                  "sum_v" : { "sum" : { "field" : "value"}}
                }
      }
    }
  },
  "unemployment_data_filtered" : {
    "size" : 0,
    "query": {
      "bool": {
        "must": [
          {"terms": {
            "country": [
            ]
          }}
        ]
      }
    },
    "aggs": {
      "by_year": {
        "terms": {
          "field": "yr",
          "size": 100
        },
        "aggs" : {
                  "sum_v" : { "sum" : { "field" : "value"}}
                }
      }
    }
  }

}

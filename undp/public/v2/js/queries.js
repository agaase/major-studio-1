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
      "country_dyads" : {
        "terms": {
          "field": "ccd",
          "size": 100
        },
        "aggs": {
          "dyads": {
            "terms": {
              "field": "d_id",
              "size": 100,
              "order" : { "sum_f" : "desc" },
              "min_doc_count": 10
            },
            "aggs" : {
              "sum_f" : { "sum" : { "field" : "best_est"}}
            }
          }
        }
      }
    }
  },
  "dyad_conflicts" : {
    "size" : 5000,
    "sort": [
      {
        "date_start": {
          "order": "asc"
        }
      }
    ], 
    "query": {
      "bool": {
        "must": [
          {"term": {
            "d_id": {
              "value": "1026"
            }
          }},
          {
            "term": {
              "ccd": {
                "value": "COD"
              }
            }
          }
        ]
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
                  "avg_v" : { "avg" : { "field" : "value"}}
                }
      }
    }
  },
  "unemployment_data_filtered_not" : {
    "size" : 0,
    "query": {
      "bool": {
        "must_not": [
          {"terms": {
            "ccode": ["DZA","SOM","ZAF","COD","SDN","NGA","AGO","ETH","UGA","SLE","BDI","CAF","KEN","RWA","LBR","LBY","SSD","TCD","MLI","SEN","MOZ","CIV","COG","CMR","NER","TGO","GIN","ZWE","DJI","ERI","MDG","GHA","MRT","GNB","NAM","TZA","ZMB","MAR","COM","LSO","SWZ","TUN","BWA"]
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
                  "avg_v" : { "avg" : { "field" : "value"}}
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
            "ccode": ["DZA","SOM","ZAF","COD","SDN","NGA","AGO","ETH","UGA","SLE","BDI","CAF","KEN","RWA","LBR","LBY","SSD","TCD","MLI","SEN","MOZ","CIV","COG","CMR","NER","TGO","GIN","ZWE","DJI","ERI","MDG","GHA","MRT","GNB","NAM","TZA","ZMB","MAR","COM","LSO","SWZ","TUN","BWA"]
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
                  "avg_v" : { "avg" : { "field" : "value"}}
                }
      }
    }
  }

}

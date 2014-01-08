#!/usr/bin/env python
import random, httplib, urllib, time

family_names = []
male_names = []
fmale_names = []

def loadFiles():
   global family_names, male_names, fmale_names

   with open("family_names_clean") as f:
      for line in f:
         family_names.append(line.strip())

   with open("names_final_male") as f:
      for line in f:
         male_names.append(line.strip())

   with open("names_final_female") as f:
      for line in f:
         fmale_names.append(line.strip())

def generateEmail(first,last):
   emails = ['gmail.com','yahoo.com','gmail.com','yahoo.com','ymail.com'] 
   formats = ['%(last)s%(deli)s%(first)s@%(email)s',
      '%(first)s%(deli)s%(last)s@%(email)s',
      '%(last)s%(deli)s%(first)s@%(email)s',
      '%(first)s%(deli)s%(last)s@%(email)s',
      '%(last)s%(deli)s%(first)s%(num)d@%(email)s',
      '%(first)s%(deli)s%(last)s%(num)d@%(email)s',
      '%(last)s%(deli)s%(first)s%(deli)s%(num)d@%(email)s',
      '%(first)s%(deli)s%(last)s%(deli)s%(num)d@%(email)s']

   delimeter = ['_','.','_','.','']
   deli = delimeter[random.randint(0,len(delimeter)-1)]
   if random.randint(0,100) >55:
      ff = deli.join(first.split())
   else:
      ff = first.split()[0]
   d = { 'first': ff,
         'deli':deli,
         'last': last,
         'email':emails[random.randint(0,len(emails)-1)],
         'num': random.randint(1,100)}

   email = formats[random.randint(0,len(formats)-1)] %(d)
   return email.lower()

def randomAddress():
   cities = ['mandaue','cebu']
   places = {'mandaue':["Alang-alang","Bakilid","Banilad","Basak","Cabancalan","Cambaro","Canduman","Casili","Casuntingan","Centro","Cubacub","Guizo","Ibabao-Estancia","Jagobiao","Labogon","Looc","Maguikay","Mantuyong","Opao","Pakna-an","Pagsabungan","Subangdaku","Tabok","Tawason","Tingub","Tipolo","Umapad"],
              'cebu':["Adlaon","Agsungot","Babag","Apas","Basak","Bacayan","Basak-Pardo","Banilad","Bonbon","Binaliw","Buhisan","Budla-an","Bulacao","Busay","Buot-Taup","Zapatera","Calamba","Cambinocot","Cogon","Capitol","Duljo-Fatima","Carreta","Guadalupe","Cogon","Inayawan","Day-as","Kalunasan","Ermita","Kinasang-an","Guba","Labangon","Hipodromo","Mambaling","Kalubihan","Pahina","Kamagayan","Pamutan","Kamputhaw","Pasil","Kasambagan","Poblacion","Lahug","Pung-ol","Lorega","Punta","Lusaran","Quiot","Luz","San","Mabini","Sapangdako","Mabolo","Sawang","Malubog","Sinsin","Pahina","Suba","Parian","Paril","Pit-os","Tabunan","Pulangbato","Tagba-O","Sambag","Tisa","Toong","San","San","San","Santa","Santo","Sirao","T. Padilla","Talamban","Taptap","Tejero","Tinago"],}

   othr = ['cebu city', 'cebu', 'mandaue', 'mandaue city', 'talisay', 'talisay city', 'consolacion', 'minglanilla']

   if random.randint(0,100) > 66:
      cty = cities[random.randint(0,1)]
      addr = places[cty][random.randint(0,len(places[cty])-1)] +[' ',',',', '][random.randint(0,2)] + cty + ['',' city'][random.randint(0,1)]
   else:
      if random.randint(0,100) < 50:
         addr = othr[random.randint(0,len(othr)-1)]
      else:
         addr = ""

   if random.randint(0,100) > 40:
      addr = addr.title()
   return addr

def generateDetails():
   #last name
   last = family_names[random.randint(0,len(family_names)-1)].title()

   if random.randint(0,100) > 70: #male
      if random.randint(0,100) > 85:   #two names
         first = male_names[random.randint(0,len(male_names)-1)]
         first += " " + male_names[random.randint(0,len(male_names)-1)]
      else:
         first = male_names[random.randint(0,len(male_names)-1)]

   else: #female
      if random.randint(0,100) > 85:   #two names
         first = fmale_names[random.randint(0,len(fmale_names)-1)]
         first += " " + fmale_names[random.randint(0,len(fmale_names)-1)]
      else:
         first = fmale_names[random.randint(0,len(fmale_names)-1)]

   first = first.title()
   return first, last

def sendVote(first,last,email,addr):
   url = "http://cebucitytourism.com/misscebu2014/voting.php"
   payload = {'fname':first,'lname':last,'email':email,'location':addr,'candidate':"4",'vote':"Vote Now"}
   params = urllib.urlencode(payload)
   headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}
   conn = httplib.HTTPConnection("cebucitytourism.com:80")
   conn.request("POST", "/misscebu2014/voting.php", params, headers)
   response = conn.getresponse()
   print response.status, response.reason
   data = response.read()
   print data
   print "===="
   conn.close()

def main():
   try:
      count = 0
      print "Ms Cebu Voter 2014 is running..."
      loadFiles()
      while count <=300:
         first,last = generateDetails()
         addr = randomAddress()
         email = generateEmail(first,last)
         print "%s\t%s\t%s\t%s"%(first,last,email,addr)
         sendVote(first,last,email,addr)
         count += 1
         time.sleep(random.randint(5,10))
   except Exception, e:
      print e
   finally:
      print "\nQuiting Ms Cebu voter"
      print "TOTAL VOTES: ",count

if __name__ == '__main__':
   main()
